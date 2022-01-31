import { mutationField, nonNull, stringArg, intArg } from 'nexus';
import tookanApi from '@treedots/tookan';
import { decipher } from '../../utils/chipper';
import { uploadFileToS3 } from '../../services/aws';
import { hash } from 'bcryptjs';
import { v1 as uuidv1 } from 'uuid';

export const addNewUser = mutationField('addNewUser', {
  type: 'TlUsers',
  args: {
    first_name: nonNull(stringArg()),
    last_name: nonNull(stringArg()),
    email: nonNull(stringArg()),
    mobile: nonNull(stringArg()),
    password: nonNull(stringArg()), //already enrypt from frontend
    passwordForTookan: nonNull(stringArg()), //plaintext password
    country_id: nonNull(intArg()),
    tl_role_id: nonNull(intArg()),
    tl_team_id: nonNull(intArg()),
    base64_image: stringArg()
  },
  resolve: async (
    _parent,
    {
      first_name,
      last_name,
      mobile,
      email,
      password,
      passwordForTookan,
      country_id,
      tl_role_id,
      tl_team_id,
      base64_image
    },
    ctx
  ) => {
    const decipherFunction = decipher();
    const sterilizedPassword = await decipherFunction(password);
    const hashedPassword = await hash(sterilizedPassword, 10);
    const fileType = base64_image.split(';')?.[0]?.split('/')?.[1];
    const newFileName = uuidv1();

    let uploadProfilePicture = null;
    if (fileType) {
      //upload image to S3 if provide from FE
      uploadProfilePicture = await uploadFileToS3(
        `${newFileName}.${fileType}`,
        base64_image,
        fileType,
        'profilePictures'
      );
    }

    const isDriver = await ctx.prisma.tlRoles.count({
      where: {
        name: 'driver'
      }
    });
    let addDriverAgent;
    if (isDriver > 0) {
      //if tl role is driver need to create on tookan too and get fleet id
      addDriverAgent = await tookanApi.addAgent({
        email: email, //required
        phone: mobile, //required
        password: passwordForTookan,
        username: first_name,
        first_name: first_name,
        last_name: last_name,
        timezone: '-480',
        rule_id: 23065,
        team_id: 61864, //required 61864 driver team id
        profile_url: uploadProfilePicture ? uploadProfilePicture : null,
        profile_thumb_url: uploadProfilePicture ? uploadProfilePicture : null
      });
    }
    const fleetId = isDriver > 0 ? addDriverAgent?.data?.fleet_id : null;
    const image = uploadProfilePicture ? uploadProfilePicture : null;

    const user = await ctx.prisma.tlUsers.create({
      data: {
        email: email,
        password: hashedPassword,
        mobile: mobile,
        first_name: first_name,
        last_name: last_name,
        country_id: country_id,
        active: true,
        fleet_id: fleetId,
        soft_delete: false,
        image: image
      }
    });

    await ctx.prisma.tlTeamUsers.create({
      data: {
        tl_user_id: user.id,
        tl_team_id: tl_team_id
      }
    });

    await ctx.prisma.tlTeamUserAccess.create({
      data: {
        tl_role_id: tl_role_id,
        tl_user_id: user.id
      }
    });

    return user;
  }
});

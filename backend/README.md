# Treedots V3 Backend

### Project Structure

```
- .env (file used for dotenv)
- src (all source files)
  - types
    - HttpStatus (list of HTTP Status in case we also use REST)
    - models (data models)
    - resolvers (GraphQL resolvers)
    - utils (Utilities Script or Shared Function)
```

### How to Run (For Developers)

#### First Time Setup

- Copy `.env.example` to `.env` and fill up necessary values
- As we are using an existing database:
  - If you do not have the existing database, request for SQL DB dump to import manually into MySQL DB
  - Go to the common prisma folder at treedots\packages\prisma and run the following commands
  - Run `npx prisma migrate resolve --applied "20210223085713_init"` to apply the init SQL migration as applied
  - Run `npx prisma migrate deploy` to apply the remaining SQL migrations
- Run `npx prisma generate`
#### Development

If there are any changes in Prisma's schema, run `npx prisma generate`.

### Throw an Error as Response
If you want to throw an error with a specific message as a response, please do not use `Error` class because it will return **Internal Server Error** as a message. You can use [Apollo Server error subclasses](https://www.apollographql.com/docs/apollo-server/data/errors/#error-codes) or [create a new one](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors) to throw an error.

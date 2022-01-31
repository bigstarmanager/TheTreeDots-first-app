import { objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.model.id();
    t.model.main_category_id();
    t.model.sub_category_id();
    t.model.active();
    t.nonNull.boolean('active');
    t.list.field('mainCategory', {
      type: 'MainCategory',
      resolve: (parent, _, context) => {
        return context.prisma.subCategory.findMany({
          where: {
            id: parent.main_category_id,
            active: true
          }
        });
      }
    });
    t.list.field('subCategory', {
      type: 'SubCategory',
      resolve: (parent, _, context) => {
        return context.prisma.subCategory.findMany({
          where: {
            id: parent.sub_category_id,
            active: true
          }
        });
      }
    });
  }
});

export const FavouriteSku = objectType({
  name: 'FavouriteSku',
  definition(t) {
    t.model.id();
    t.model.account_number();
    t.model.user_id();
    t.model.sku_id();
    t.model.created_by();
    t.model.created_at();
    t.model.updated_by();
    t.model.updated_at();
    t.nonNull.boolean('active');
  }
});

export const Inventory = objectType({
  name: 'Inventory',
  definition(t) {
    t.model.id();
    t.model.stock_location_id();
    t.model.customer_id();
    t.model.sku_id();
    t.model.product_type_id();
    t.field('expired_at', { type: 'Date' });
    t.decimal('Decimal');
    t.decimal('unit_amount');
    t.decimal('price');
    t.model.quantity();
    t.model.logistic_type();
    t.model.rank();
    t.model.default_sku();
    t.decimal('par_level');
    t.decimal('min_qty');
    t.model.description();
    t.model.active();
    t.model.created_at();
    t.model.updated_at();
    t.model.stock_location();
  }
});

export const LogisticType = objectType({
  name: 'LogisticType',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const MainCategory = objectType({
  name: 'MainCategory',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.image();
    t.model.description();
    t.model.active();
    t.list.field('subCategory', {
      type: 'SubCategory',
      resolve: async (parent, _, context) => {
        const categoryList = await context.prisma.category.findMany({
          where: {
            active: true,
            main_category_id: parent.id
          },
          select: {
            sub_category_id: true
          }
        });
        const sterilizedCategoryList: number[] = categoryList.map(function (field) {
          return field['sub_category_id'];
        });
        return await context.prisma.subCategory.findMany({
          where: {
            id: {
              in: sterilizedCategoryList
            }
          }
        });
      }
    });
  }
});

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.model.id();
    t.model.tenant_id();
    t.model.category_id();
    t.model.name();
    t.model.image();
    t.model.voucherify_id();
    t.model.tenant();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
    t.field('category', {
      type: 'Category',
      resolve: async (parent, _, context) => {
        return await context.prisma.category.findUnique({
          where: {
            id: parent.category_id
          }
        });
      }
    });
    t.list.field('customers', {
      type: 'Customer',
      resolve: async (parent, _, context) => {
        return await context.prisma.customer.findMany({
          where: {
            customer_type_id: 3,
            tenant_id: parent.tenant_id
          }
        });
      }
    });
    t.list.field('skus', {
      type: 'Sku',
      resolve: async (parent, _, context) => {
        return await context.prisma.sku.findMany({
          where: {
            product_id: parent.id,
            b2c: true
          }
        });
      }
    });
    t.list.field('customer_tenants', {
      type: 'CustomerTenant',
      resolve: async (parent, _, context) => {
        return await context.prisma.customerTenant.findMany({
          where: {
            tenant_id: parent.tenant_id
          }
        });
      }
    });
    //Added to fix the inventory issue in product API
    t.list.field('inventories', {
      type: 'Inventory',
      resolve: async (parent, _, context) => {
        return await context.prisma.inventory.findMany({
          where: {
            sku_id: parent.id,
            active: true,
            OR: [
              {
                quantity: {
                  gt: 0
                }
              },
              {
                quantity: -1
              }
            ]
          }
        });
      }
    });
  }
});

export const GroupBuyProducts = objectType({
  name: 'GroupBuyProducts',
  definition(t) {
    t.int('id');
    t.int('tenant_id');
    t.int('category_id');
    t.string('name');
    t.string('image');
    t.string('voucherify_id');
    t.int('tenant_id');
    t.boolean('active');
    t.float('discount');
    t.field('category', {
      type: 'Category',
      resolve: async (parent, _, context) => {
        return await context.prisma.category.findUnique({
          where: {
            id: parent.category_id
          }
        });
      }
    });
    t.list.field('customers', {
      type: 'Customer',
      resolve: async (parent, _, context) => {
        return await context.prisma.customer.findMany({
          where: {
            customer_type_id: 3,
            tenant_id: parent.tenant_id
          }
        });
      }
    });
    t.list.field('skus', {
      type: 'Sku',
      resolve: async (parent, _, context) => {
        return await context.prisma.sku.findMany({
          where: {
            product_id: parent.id,
            b2c: true,
            is_b2c_pooling: true,
            active: true
          }
        });
      }
    });
    t.field('tenant', {
      type: 'Tenant',
      resolve: async (parent, _, context) => {
        return await context.prisma.tenant.findUnique({
          where: {
            id: parent.tenant_id
          }
        });
      }
    });
    t.list.field('customer_tenants', {
      type: 'CustomerTenant',
      resolve: async (parent, _, context) => {
        return await context.prisma.customerTenant.findMany({
          where: {
            tenant_id: parent.tenant_id
          }
        });
      }
    });
  }
});

export const ProductWithHotDiscount = objectType({
  name: 'ProductWithHotDiscount',
  definition(t) {
    t.int('id');
    t.int('tenant_id');
    t.int('category_id');
    t.string('name');
    t.string('image');
    t.string('voucherify_id');
    t.int('tenant_id');
    t.boolean('active');
    t.float('max_amount');
    t.float('max_market_price');
    t.float('max_price');
    t.float('min_amount');
    t.float('min_market_price');
    t.float('min_price');
    t.float('discount');
    t.field('tenant', {
      type: 'Tenant',
      resolve: async (parent, _, context) => {
        return await context.prisma.tenant.findUnique({
          where: {
            id: parent.tenant_id
          }
        });
      }
    });
    t.field('category', {
      type: 'Category',
      resolve: async (parent, _, context) => {
        return await context.prisma.category.findUnique({
          where: {
            id: parent.category_id
          }
        });
      }
    });
    t.list.field('skus', {
      type: 'Sku',
      resolve: async (parent, _, context) => {
        return await context.prisma.sku.findMany({
          where: {
            product_id: parent.id,
            b2c: true
          }
        });
      }
    });
  }
});

export const ProductType = objectType({
  name: 'ProductType',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const ActualSkuWithPagination = objectType({
  name: 'ActualSkuWithPagination',
  definition(t) {
    t.list.field('actual_sku', { type: 'ActualSku' });
    t.int('total_rows');
    t.int('total_page');
  }
});

export const ActualSku = objectType({
  name: 'ActualSku',
  definition(t) {
    t.model.catch_weight_bool();
    t.model.country_of_origin();
    t.model.description();
    t.model.details_estimation_bool();
    t.model.expiry();
    t.model.external_sku_id();
    t.model.freshness();
    t.model.id();
    t.model.name();
    t.model.packaging();
    t.model.price();
    t.model.sku_code();
    t.model.supplier_id();
    t.model.supplier_product_name();
    t.model.temperature_req();
    t.model.treedots_external_sku_key();
    t.model.unit_amount();
    t.model.unit_price();
    t.model.volume_height();
    t.model.volume_length();
    t.model.volume_width();
    t.model.weight_from();
    t.model.weight_to();
    t.model.weight_type();
    t.model.supplier();
    t.list.field('Inventory', { type: 'Inventory' });
    t.list.field('WeightType', { type: 'WeightType' });
  }
});

export const Sku = objectType({
  name: 'Sku',
  definition(t) {
    t.model.id();
    t.model.product_id();
    t.model.voucherify_sku_id();
    t.model.is_order_by_weight();
    t.model.name();
    t.model.vendor_code();
    t.model.is_sample();
    t.model.alias();
    t.model.halal();
    t.model.perishable();
    t.model.oom_id();
    t.model.uom();
    t.model.uom_id();
    t.model.oom();
    t.nonNull.decimal('unit_per_oom');
    t.model.increment_qty();
    t.nonNull.decimal('weight');
    t.nonNull.decimal('price');
    t.nonNull.decimal('market_unit_price');
    t.nonNull.decimal('total_price');
    t.nonNull.decimal('total_market_price');
    t.nonNull.decimal('tax_rate');
    t.model.image();
    t.model.specs();
    t.model.country_of_origin();
    t.model.b2c();
    t.model.b2c_uom_id();
    t.model.b2c_uom();
    t.nonNull.decimal('b2c_unit_per_oom');
    t.model.b2c_increment_qty();
    t.nonNull.decimal('b2c_unit_price');
    t.nonNull.decimal('b2c_market_unit_price');
    t.nonNull.decimal('b2c_total_price');
    t.nonNull.decimal('b2c_total_market_price');
    t.model.b2c_pooling_qty();
    t.model.b2c_packaging();
    t.nonNull.decimal('b2c_weight');
    t.model.b2c_oom_id();
    t.model.b2c_oom();
    t.model.is_b2c_pooling();
    t.model.description();
    t.model.is_slack_notifiable();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
    t.model.product();
    t.model.Pool();
    t.model.sku_deals();
    t.list.field('inventories', {
      type: 'Inventory',
      resolve: async (parent, _, context) => {
        return await context.prisma.inventory.findMany({
          where: {
            sku_id: parent.id,
            active: true,
            OR: [
              {
                quantity: {
                  gt: 0
                }
              },
              {
                quantity: -1
              }
            ]
          }
        });
      }
    }),
      t.list.field('pools', {
        type: 'Pool',
        resolve: async (parent, _, context) => {
          return await context.prisma.pool.findMany({
            where: { sku_id: parent.id },
            orderBy: { id: 'desc' }
          });
        }
      }),
      t.field('last_pool', {
        type: 'Pool',
        resolve: async (parent, _, context) => {
          return await context.prisma.pool.findFirst({
            where: { sku_id: parent.id },
            orderBy: { id: 'desc' }
          });
        }
      });
    t.model.SkuActualSkus();
  }
});

export const SkuActualSku = objectType({
  name: 'SkuActualSku',
  definition(t) {
    t.model.id();
    t.field('actual_sku', { type: 'ActualSku' });
    t.model.sku_id();
    t.model.actual_sku_id();
    t.model.sku();
    t.model.rank();
    t.model.actual_sku();
    t.int('availability');
  }
});

export const ActualSkusQuantityLog = objectType({
  name: 'ActualSkusQuantityLog',
  definition(t) {
    t.model.id();
    t.model.stock_locations_lot_id();
    t.model.quantity();
    t.model.actual_sku_id();
    t.model.po_number();
    t.model.unit_price();
    t.model.order_id();
    t.model.price();
    t.model.date_created();
    t.model.reason();
  }
});

export const SkuDeal = objectType({
  name: 'SkuDeal',
  definition(t) {
    t.model.id();
    t.model.sku_id();
    t.model.quantity();
    t.model.discount();
    t.model.rank();
    t.model.default();
    t.model.created_at();
    t.model.created_by();
    t.model.updated_at();
    t.model.updated_by();
    t.model.active();
    t.model.sku();
  }
});

export const Spec = objectType({
  name: 'Spec',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const Uom = objectType({
  name: 'Uom',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.boolean('active');
  }
});

export const SubCategory = objectType({
  name: 'SubCategory',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const ProductDetail = objectType({
  name: 'ProductDetail',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.string('image');
    t.nonNull.decimal('tax_rate');
    t.decimal('max_amount');
    t.decimal('max_market_price');
    t.decimal('max_price');
    t.decimal('min_amount');
    t.decimal('min_market_price');
    t.decimal('min_price');
    t.nonNull.list.field('skus', { type: 'Sku' });
  }
});

export const PopularProduct = objectType({
  name: 'PopularProduct',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.int('tenant_id');
    t.int('category_id');
    t.string('image');
    t.string('voucherify_id');
    t.int('tenant_id');
    t.boolean('active');
    t.float('max_amount');
    t.float('max_market_price');
    t.float('max_price');
    t.float('min_amount');
    t.float('min_market_price');
    t.float('min_price');
    t.float('discount');
    t.field('tenant', {
      type: 'Tenant',
      resolve: async (parent, _, context) => {
        return parent.tenant_id
          ? await context.prisma.tenant.findUnique({
              where: {
                id: parent.tenant_id
              }
            })
          : null;
      }
    });
    t.field('category', {
      type: 'Category',
      resolve: async (parent, _, context) => {
        return parent.category_id
          ? await context.prisma.category.findUnique({
              where: {
                id: parent.category_id
              }
            })
          : null;
      }
    });
    t.list.field('skus', {
      type: 'Sku',
      resolve: async (parent, _, context) => {
        return await context.prisma.sku.findMany({
          where: {
            product_id: parent.id,
            b2c: true
          }
        });
      }
    });
  }
});

export const ProductHome = objectType({
  name: 'ProductHome',
  definition(t) {
    t.nonNull.list.field('top_picks', { type: 'Product' });
    t.nonNull.list.field('discounts', { type: 'ProductWithHotDiscount' });
    t.nonNull.list.field('group_buy', { type: 'Product' });
    t.nonNull.list.field('suppliers', { type: 'Tenant' });
    t.nonNull.list.field('categories', { type: 'MainCategory' });
  }
});

export const WeightType = objectType({
  name: 'WeightType',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.active();
  }
});

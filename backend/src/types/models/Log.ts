import { objectType } from 'nexus';

export const ApplicationLog = objectType({
  name: 'ApplicationLog',
  definition(t) {
    t.model.id();
    t.model.obj_user();
    t.model.obj_name();
    t.model.obj_method();
    t.model.obj_parameter();
    t.model.obj_value();
    t.model.created_at();
  }
});

export const ErrorLog = objectType({
  name: 'ErrorLog',
  definition(t) {
    t.model.id();
    t.model.error_type();
    t.model.error_message();
    t.model.created_at();
  }
});

export const FinanceOperation = objectType({
  name: 'FinanceOperation',
  definition(t) {
    t.model.id();
    t.model.uuid();
    t.model.invoice_id();
    t.model.user_id();
    t.model.user_name();
    t.model.description();
    t.model.created_at();
  }
});

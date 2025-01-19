import { EntitySchema } from "typeorm";

export const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    userId: {
      type: "uuid",
      name: "user_id",
    },
    orderId: {
      type: "varchar",
      unique: true,
    },
    amount: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    status: {
      type: "varchar",
      default: "pending",
    },
    paymentDate: {
      name: "payment_date",
      type: "varchar",
      nullable: true,
    },
    transactionNo: {
      name: "transaction_no",
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
    },
  },
});

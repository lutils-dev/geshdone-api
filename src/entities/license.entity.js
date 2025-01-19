import { EntitySchema } from "typeorm";

export const License = new EntitySchema({
  name: "License",
  tableName: "licenses",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    userId: {
      type: "uuid",
      name: "user_id"
    },
    type: {
      type: "varchar",
    },
    status: {
      type: "varchar",
    },
    purchasedAt: {
      name: "purchased_at",
      type: "timestamp",
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
      joinColumn: { name: "user_id" }
    }
  }
});

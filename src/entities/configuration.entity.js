import { EntitySchema } from "typeorm";

export const Configuration = new EntitySchema({
  name: "Configuration",
  tableName: "configurations",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    key: {
      type: "varchar",
      unique: true,
    },
    value: {
      type: "jsonb",
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
});

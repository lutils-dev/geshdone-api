import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    googleId: {
      type: "varchar",
      nullable: true,
    },
    preferredModel: {
      type: "varchar",
      default: "openai",
      name: "preferred_model",
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

export { User };

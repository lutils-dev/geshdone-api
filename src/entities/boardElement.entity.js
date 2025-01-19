import { EntitySchema } from "typeorm";

export const BoardElement = new EntitySchema({
  name: "BoardElement",
  tableName: "board_elements",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    boardId: {
      name: "board_id",
      type: "uuid",
    },
    type: {
      type: "varchar",
    },
    position: {
      type: "jsonb",
    },
    size: {
      type: "jsonb",
    },
    rotation: {
      type: "float",
      default: 0,
    },
    style: {
      type: "jsonb",
    },
    content: {
      type: "text",
      nullable: true,
    },
    imageData: {
      name: "image_data",
      type: "jsonb",
      nullable: true,
    },
    groupId: {
      name: "group_id",
      type: "varchar",
      nullable: true,
    },
    zIndex: {
      name: "z_index",
      type: "int",
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    board: {
      type: "many-to-one",
      target: "Board",
      joinColumn: { name: "board_id" },
    },
  },
});

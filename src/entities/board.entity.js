import { EntitySchema } from "typeorm";

export const Board = new EntitySchema({
  name: "Board",
  tableName: "boards",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    userId: {
      name: "user_id",
      type: "uuid",
    },
    title: {
      type: "varchar",
    },
    originalPrompt: {
      name: "original_prompt",
      type: "text",
    },
    canvasSize: {
      name: "canvas_size",
      type: "jsonb",
    },
    theme: {
      type: "jsonb",
    },
    aiAnalysis: {
      name: "ai_analysis",
      type: "jsonb",
    },
    isArchived: {
      name: "is_archived",
      type: "boolean",
      default: false,
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
    elements: {
      type: "one-to-many",
      target: "BoardElement",
      inverseSide: "board",
      cascade: true,
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
    },
  },
});

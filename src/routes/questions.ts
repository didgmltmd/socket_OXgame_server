import express from "express";
import { QUESTIONS } from "../config";
const router = express.Router();

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: 퀴즈 문제 목록 조회
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: 문제 목록 반환
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 text: "문제 1: O/X 중 고르세요!"
 *                 answer: "O"
 */
router.get("/", (_, res) => {
  res.json(QUESTIONS);
});

export default router;

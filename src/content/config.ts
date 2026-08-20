import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('陳昱彰醫師'),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    // TL;DR 重點 3 句話(顯示在文章開頭,AI 摘要引擎喜歡抓的「30 秒回答版」)
    tldr: z.array(z.string()).min(2).max(5).optional(),
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .optional(),
    // 文章主要關聯的醫療議題（用於 BlogPosting / MedicalWebPage.about）
    medicalCondition: z.string().optional(),
  }),
});

export const collections = { blog };

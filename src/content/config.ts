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
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .optional(),
    // 設為 true 會把 schema.org 類型從 BlogPosting 升級為 MedicalScholarlyArticle
    // (給引用 RCT / 系統性回顧 / meta-analysis 的文章使用，增加醫療內容權威信號)
    scholarly: z.boolean().optional().default(false),
    // 文章主要關聯的醫療議題（用於 MedicalScholarlyArticle.about 與 MedicalCondition）
    medicalCondition: z.string().optional(),
  }),
});

export const collections = { blog };

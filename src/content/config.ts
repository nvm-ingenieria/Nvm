// src/content/config.ts
import { defineCollection, z } from "astro:content";

const familias = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        description: z.string().optional(),
        cover: image().optional(),
        order: z.number().optional(),
        whatsappMessage: z.string().optional(),

        especificaciones: z
            .object({
                electrica: z
                    .object({
                        tension_nominal: z.string().optional(),
                        corriente_nominal: z.string().optional(),
                        cortocircuito: z.string().optional(),
                    })
                    .optional(),
                mecanica: z
                    .object({
                        grado_ip: z.string().optional(),
                        impacto_ik: z.string().optional(),
                        camara_salina: z.string().optional(),
                    })
                    .optional(),
                usos: z.array(z.string()).optional(),
                condiciones: z.array(z.string()).optional(),
            })
            .optional(),

        productos: z
            .array(
                z.object({
                    nombre: z.string(),
                    descripcion: z.string().optional(),
                    imagen: image().optional(),
                    fit: z.enum(["cover", "contain"]).optional(), // por si quieres recorte bonito por producto
                    href: z.string().optional(),
                })
            )
            .optional(),

            seo: z
                .object({
                    title: z.string().optional(),
                    description: z.string().optional(),

                    canonical: z
                        .union([z.string().url(), z.string().regex(/^\/.+/)])
                        .optional(),

                    ogImage: z
                        .union([z.string().url(), z.string().regex(/^\/.+/)])
                        .optional(),
                })
                .optional(),

        }),
});

export const collections = { familias };

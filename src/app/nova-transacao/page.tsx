"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const schema = z.object({
  type: z.enum(["entrada", "saida", "cartao"]),
  value: z.number().positive(),
  date: z.string().nonempty(),
  description: z.string().min(2),
  category: z.string().nonempty(),
  cardName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovaTransacaoPage() {
  const router = useRouter();
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "entrada",
    },
  });

  useEffect(() => {
    const editando = localStorage.getItem("transacaoEditando");
    if (editando) {
      const t = JSON.parse(editando);
      setEditandoId(t.id);

      reset({
        type: t.type,
        value: t.value,
        date: t.date,
        description: t.description,
        category: t.category,
        cardName: t.cardName || "",
      });

      localStorage.removeItem("transacaoEditando");
    }
  }, [reset]);

  const onSubmit = (data: FormData) => {
    const transacoes = JSON.parse(localStorage.getItem("transacoes") || "[]");

    let atualizadas;

    if (editandoId) {
      atualizadas = transacoes.map((t: any) =>
        t.id === editandoId ? { ...data, id: editandoId } : t
      );
    } else {
      atualizadas = [...transacoes, { ...data, id: crypto.randomUUID() }];
    }

    localStorage.setItem("transacoes", JSON.stringify(atualizadas));
    reset();
    router.push("/transacoes");
  };

  const tipo = watch("type");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Nova Transação</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Tipo:</label>
          <select {...register("type")} className="p-2 border rounded">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="cartao">Cartão</option>
          </select>
        </div>

        <div>
          <label className="block">Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            {...register("value", { valueAsNumber: true })}
            className="p-2 border rounded w-full"
          />
          {errors.value && (
            <p className="text-red-500">{errors.value.message}</p>
          )}
        </div>

        <div>
          <label className="block">Data:</label>
          <input
            type="date"
            {...register("date")}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block">Descrição:</label>
          <input
            type="text"
            {...register("description")}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block">Categoria:</label>
          <input
            type="text"
            {...register("category")}
            className="p-2 border rounded w-full"
          />
        </div>

        {tipo === "cartao" && (
          <div>
            <label className="block">Nome do Cartão:</label>
            <input
              type="text"
              {...register("cardName")}
              className="p-2 border rounded w-full"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editandoId ? "Atualizar" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

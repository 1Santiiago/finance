"use client";

import Header from "@/components/Header/Header";
import { useEffect, useState } from "react";

type Transacao = {
  id: string;
  type: "entrada" | "saida" | "cartao";
  value: number;
  date: string;
  description: string;
  category: string;
  cardName?: string;
};

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("transacoes") || "[]");
    setTransacoes(data);
  }, []);

  const mesesUnicos = Array.from(
    new Set(
      transacoes.map((t) => {
        const [ano, mes] = t.date.split("-");
        return `${ano}-${mes}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a)); // do mais recente pro mais antigo

  const transacoesFiltradas = mesSelecionado
    ? transacoes.filter((t) => t.date.startsWith(mesSelecionado))
    : transacoes;

  const handleExcluir = (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;

    const novas = transacoes.filter((t) => t.id !== id);
    setTransacoes(novas);
    localStorage.setItem("transacoes", JSON.stringify(novas));
  };

  const handleEditar = (transacao: Transacao) => {
    localStorage.setItem("transacaoEditando", JSON.stringify(transacao));
    window.location.href = "/nova-transacao";
  };
  const exportarCSVDoMesAtual = () => {
    const todasTransacoes = JSON.parse(
      localStorage.getItem("transacoes") || "[]"
    );

    if (!todasTransacoes.length) {
      alert("Nenhuma transação para exportar.");
      return;
    }

    const filtradas = mesSelecionado
      ? todasTransacoes.filter((t: Transacao) =>
          t.date.startsWith(mesSelecionado)
        )
      : todasTransacoes;

    if (!filtradas.length) {
      alert("Nenhuma transação nesse mês.");
      return;
    }

    const cabecalho = [
      "Data",
      "Tipo",
      "Descrição",
      "Categoria",
      "Valor (R$)",
      "Cartão",
    ];

    const linhas = filtradas.map((t: Transacao) => [
      new Date(t.date).toLocaleDateString("pt-BR"),
      t.type,
      t.description,
      t.category,
      `R$ ${t.value.toFixed(2).replace(".", ",")}`,
      t.cardName || "-",
    ]);

    const csv = [cabecalho, ...linhas]
      .map((linha) =>
        linha
          .map((campo: any) => `"${String(campo).replace(/"/g, '""')}"`)
          .join(";")
      )
      .join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

    const nomeArquivo = mesSelecionado
      ? `transacoes-${mesSelecionado}.csv`
      : "transacoes-completas.csv";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nomeArquivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transações</h2>
      <div className="mb-4">
        <label className="block mb-1">Filtrar por mês:</label>
        <select
          className="p-2 border rounded"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        >
          <option value="">Todos</option>
          {mesesUnicos.map((mes) => (
            <option key={mes} value={mes}>
              {new Date(mes + "-01").toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
        <button
          onClick={exportarCSVDoMesAtual}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Exportar do Mês Atual
        </button>
      </div>
      {transacoesFiltradas.length === 0 ? (
        <p className="text-gray-500">Nenhuma transação nesse mês.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Data</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Cartão</th>
            </tr>
          </thead>
          <tbody>
            {transacoesFiltradas.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.date}</td>
                <td className="p-2 capitalize">{t.type}</td>
                <td className="p-2">{t.description}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2 text-right">R$ {t.value.toFixed(2)}</td>
                <td className="p-2">{t.cardName || "-"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditar(t)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(t.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

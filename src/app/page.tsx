"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Transacao = {
  id: string;
  type: "entrada" | "saida" | "cartao";
  value: number;
  date: string;
  description: string;
  category: string;
  cardName?: string;
};

const cores = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#00bcd4",
  "#ff1493",
  "#00fa9a",
  "#ffa500",
  "#6a5acd",
];

export default function Home() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [cartoes, setCartoes] = useState(0);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const data: Transacao[] = JSON.parse(
      localStorage.getItem("transacoes") || "[]"
    );
    setTransacoes(data);

    const totalEntrada = data
      .filter((t) => t.type === "entrada")
      .reduce((acc, t) => acc + t.value, 0);
    const totalSaida = data
      .filter((t) => t.type === "saida")
      .reduce((acc, t) => acc + t.value, 0);
    const totalCartao = data
      .filter((t) => t.type === "cartao")
      .reduce((acc, t) => acc + t.value, 0);

    setEntradas(totalEntrada);
    setSaidas(totalSaida);
    setCartoes(totalCartao);
    setSaldo(totalEntrada - totalSaida - totalCartao);
  }, []);

  // 📊 Dados para gráfico de pizza (por categoria)
  const categoriasTotais = transacoes.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = 0;
    acc[t.category] += t.value;
    return acc;
  }, {} as Record<string, number>);

  const dadosPizza = Object.entries(categoriasTotais).map(
    ([categoria, total]) => ({
      name: categoria,
      value: total,
    })
  );

  // 📊 Dados para gráfico de barras (por tipo)
  const dadosBarra = [
    { name: "Entradas", total: entradas },
    { name: "Saídas", total: saidas },
    { name: "Cartões", total: cartoes },
  ];

  return (
    <>
      <Header />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Resumo Financeiro</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 border border-green-400 p-4 rounded">
            <p className="text-sm text-green-800">Entradas</p>
            <p className="text-2xl font-bold text-green-900">
              R$ {entradas.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-100 border border-red-400 p-4 rounded">
            <p className="text-sm text-red-800">Saídas</p>
            <p className="text-2xl font-bold text-red-900">
              R$ {saidas.toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-100 border border-purple-400 p-4 rounded">
            <p className="text-sm text-purple-800">Cartões</p>
            <p className="text-2xl font-bold text-purple-900">
              R$ {cartoes.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-100 border border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-800">Saldo Atual</p>
            <p className="text-2xl font-bold text-blue-900">
              R$ {saldo.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border rounded p-4">
            <h3 className="text-lg font-bold mb-2">
              Distribuição por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {dadosPizza.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={cores[index % cores.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border rounded p-4">
            <h3 className="text-lg font-bold mb-2">Totais por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosBarra}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link href="/nova-transacao">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Nova Transação
            </button>
          </Link>
          <Link href="/transacoes">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Ver Transações
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

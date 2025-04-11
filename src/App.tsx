import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

type Moeda = {
  code: string;
  name: string;
  flag: string;
};

type ExchangeRateApiResponse = {
  conversion_rate: number;
};

export default function App() {
  const [moedaUmSelecionada, setMoedaUmSelecionada] = useState<string>("USD");
  const [moedaDoisSelecionada, setMoedaDoisSelecionada] = useState<string>("BRL");
  const [valor, setValor] = useState<string>("");
  const [moedaNome, setMoedaNome] = useState<string>("Real Brasileiro");
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [valorConvertido, setValorConvertido] = useState<number | null>(null);

  const moedas: Moeda[] = [
    { code: "USD", name: "Dólar Americano", flag: "us" },
    { code: "EUR", name: "Euro", flag: "eu" },
    { code: "JPY", name: "Iene Japonês", flag: "jp" },
    { code: "GBP", name: "Libra Esterlina", flag: "gb" },
    { code: "AUD", name: "Dólar Australiano", flag: "au" },
    { code: "CAD", name: "Dólar Canadense", flag: "ca" },
    { code: "CHF", name: "Franco Suíço", flag: "ch" },
    { code: "CNY", name: "Yuan Chinês", flag: "cn" },
    { code: "BRL", name: "Real Brasileiro", flag: "br" },
    { code: "NZD", name: "Dólar Neozelandês", flag: "nz" },
  ];

  const flagUrl = (code: string) => {
    const moeda = moedas.find(m => m.code === code);
    return moeda ? `https://flagcdn.com/w160/${moeda.flag}.png` : "";
  };

  useEffect(() => {
    if (moedaUmSelecionada && moedaDoisSelecionada) {
      axios
        .get<ExchangeRateApiResponse>(`http://localhost:5000/api/cambio/${moedaUmSelecionada}/${moedaDoisSelecionada}`)
        .then(response => {
          const valorConversao = response.data.conversion_rate;
          setCotacao(valorConversao);

          const moedaDestino = moedas.find(m => m.code === moedaDoisSelecionada);
          if (moedaDestino) {
            setMoedaNome(moedaDestino.name);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar cotação:", err);
        });
    }
  }, [moedaUmSelecionada, moedaDoisSelecionada]);

  useEffect(() => {
    if (valor && cotacao) {
      setValorConvertido(Number(valor) * cotacao);
    } else {
      setValorConvertido(null);
    }
  }, [valor, cotacao]);

  const Dia = new Date().getDate().toString().padStart(2, '0');
  const Mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const Ano = new Date().getFullYear().toString().padStart(2, '0');

  return (
    <div className="bg-white w-full h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col w-[20%] justify-center items-center ">
        <span className="text-3xl font-bold text-[#474747] ">
          COTAÇÃO DO DIA 
        </span>
        <span className="text-2xl font-bold text-[#474747]">
          {Dia}/{Mes}/{Ano}
        </span>
      </div>
      <div className="bg-white grid grid-cols-[5fr_5fr] h-[70%] w-[70%] py-10 gap-6">
        <div className="grid grid-rows-2 justify-center text-[#474747] max-w-[100%] w-[100%]  border-r border-[#D0D0D0]">
          <div className="flex flex-col justify-center items-center w-80 gap-8 ">
            <div className="w-full flex justify-between gap-8">
              <select
                value={moedaUmSelecionada}
                className="w-full h-14 bg-[#D0D0D0] pl-4"
                onChange={(e) => setMoedaUmSelecionada(e.target.value)}
              >
                {moedas.map((moeda) => (
                  <option key={moeda.code} value={moeda.code}>
                    {moeda.name}
                  </option>
                ))}
              </select>
              <img className="h-14 w-1/4 min-w-1/4 border border-black" src={flagUrl(moedaUmSelecionada)} alt={`Bandeira de ${moedaUmSelecionada}`} />
            </div>
            <input
              className="w-full h-14 bg-[#D0D0D0] pl-4"
              type="number"
              placeholder="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div className="flex items-center  justify-center border-t border-[#D0D0D0] ">
            <div className="w-full flex justify-between gap-8">
              <select
                className="w-full h-14 bg-[#D0D0D0] pl-4"
                value={moedaDoisSelecionada}
                onChange={(e) => setMoedaDoisSelecionada(e.target.value)}
              >
                {moedas.map((moeda) => (
                  <option key={moeda.code} value={moeda.code}>
                    {moeda.name}
                  </option>
                ))}
              </select>
              <img className="h-14 w-1/4 min-w-1/4 border border-black" src={flagUrl(moedaDoisSelecionada)} alt={`Bandeira de ${moedaDoisSelecionada}`} />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          {valorConvertido == null && (
            <span className="text-5xl font-bold text-[#474747] text-center">
              0 {moedaNome}
            </span>
          )}
          {valorConvertido != null && (
            <span className="text-5xl font-bold text-[#474747] text-center">
              {valorConvertido.toFixed(2)} {moedaNome}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

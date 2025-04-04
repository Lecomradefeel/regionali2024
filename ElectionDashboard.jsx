import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import MapUU from './MapUU';

const ElectionDashboard = () => {
  const [data, setData] = useState({
    datiCoalizioni: [],
    datiAstensionismo: [],
    datiCsx: [],
    datiCdx: [],
    datiPerMunicipioGrafico: [],
    top20UnitaUrbanistiche: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('municipi');

  const COLORS = {
    csx: '#D71F1F',
    cdx: '#0066CC',
    altro: '#FFD700',
    pd: '#F78DA7',
    avs: '#8B0000',
    m5s: '#FFCC00',
    listeOrlando: '#FF6600',
    fdi: '#003366',
    lega: '#006600',
    fi: '#00BFFF',
    listeBucci: '#0088CC',
    votanti: '#4CAF50',
    nonVotanti: '#9E9E9E',
    schedeBianche: '#FFFFFF',
    schedeNulle: '#000000'
  };

  // Funzioni di formattazione
  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Tooltip personalizzato per i grafici a torta
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{payload[0].name}</p>
          <p>Voti: {formatNumber(payload[0].value)}</p>
          <p>Percentuale: {payload[0].payload.percentuale.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizzato per i grafici a barre
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const datiCoalizioni = [
          { nome: "CSX", voti: 115992, percentuale: 51.61 },
          { nome: "CDX", voti: 94241, percentuale: 41.93 },
          { nome: "Altro", voti: 7631, percentuale: 3.40 },
          { nome: "Schede bianche", voti: 1217, percentuale: 0.54 },
          { nome: "Schede nulle", voti: 5610, percentuale: 2.50 }
        ];

        const datiAstensionismo = [
          { nome: "Votanti", voti: 224761, percentuale: 46.93 },
          { nome: "Non votanti", voti: 254117, percentuale: 53.07 }
        ];

        const datiCsx = [
          { nome: "PD", voti: 64758, percentuale: 55.83 },
          { nome: "AVS", voti: 16467, percentuale: 14.20 },
          { nome: "M5S", voti: 11937, percentuale: 10.29 },
          { nome: "Liste Orlando", voti: 22830, percentuale: 19.68 }
        ];

        const datiCdx = [
          { nome: "FdI", voti: 29453, percentuale: 31.25 },
          { nome: "Lega", voti: 14313, percentuale: 15.19 },
          { nome: "Forza Italia", voti: 8950, percentuale: 9.50 },
          { nome: "Liste Bucci", voti: 41525, percentuale: 44.06 }
        ];

        // Dati di esempio per municipi e unità urbanistiche
        // In una vera applicazione, questi dati sarebbero caricati da API o file
        const datiPerMunicipioGrafico = [
          { name: "Centro Est", csx: 60, cdx: 35, altro: 5, affluenza: 52, pd: 35, avs: 10, m5s: 5, listeOrlando: 10, fdi: 15, lega: 7, fi: 3, listeBucci: 10 },
          { name: "Centro Ovest", csx: 58, cdx: 37, altro: 5, affluenza: 48, pd: 33, avs: 10, m5s: 5, listeOrlando: 10, fdi: 17, lega: 7, fi: 3, listeBucci: 10 },
          { name: "Bassa Val Bisagno", csx: 55, cdx: 40, altro: 5, affluenza: 45, pd: 30, avs: 10, m5s: 5, listeOrlando: 10, fdi: 18, lega: 8, fi: 4, listeBucci: 10 },
          { name: "Media Val Bisagno", csx: 50, cdx: 45, altro: 5, affluenza: 44, pd: 28, avs: 8, m5s: 6, listeOrlando: 8, fdi: 20, lega: 9, fi: 4, listeBucci: 12 },
          { name: "Valpolcevera", csx: 48, cdx: 47, altro: 5, affluenza: 42, pd: 26, avs: 8, m5s: 6, listeOrlando: 8, fdi: 21, lega: 10, fi: 4, listeBucci: 12 },
          { name: "Medio Ponente", csx: 47, cdx: 48, altro: 5, affluenza: 43, pd: 25, avs: 8, m5s: 6, listeOrlando: 8, fdi: 22, lega: 10, fi: 4, listeBucci: 12 },
          { name: "Ponente", csx: 45, cdx: 50, altro: 5, affluenza: 44, pd: 24, avs: 7, m5s: 6, listeOrlando: 8, fdi: 23, lega: 11, fi: 4, listeBucci: 12 },
          { name: "Medio Levante", csx: 53, cdx: 42, altro: 5, affluenza: 50, pd: 30, avs: 9, m5s: 6, listeOrlando: 8, fdi: 18, lega: 9, fi: 5, listeBucci: 10 },
          { name: "Levante", csx: 52, cdx: 43, altro: 5, affluenza: 52, pd: 29, avs: 9, m5s: 6, listeOrlando: 8, fdi: 19, lega: 9, fi: 5, listeBucci: 10 }
        ];

        const top20UnitaUrbanistiche = [
          { name: "Castelletto", csx: 62, cdx: 33, altro: 5, affluenza: 55, pd: 36, avs: 11, m5s: 5, listeOrlando: 10, fdi: 14, lega: 6, fi: 3, listeBucci: 10 },
          { name: "Foce", csx: 58, cdx: 37, altro: 5, affluenza: 53, pd: 33, avs: 10, m5s: 5, listeOrlando: 10, fdi: 16, lega: 7, fi: 4, listeBucci: 10 },
          { name: "Albaro", csx: 54, cdx: 41, altro: 5, affluenza: 54, pd: 31, avs: 9, m5s: 5, listeOrlando: 9, fdi: 18, lega: 8, fi: 5, listeBucci: 10 },
          { name: "San Fruttuoso", csx: 56, cdx: 39, altro: 5, affluenza: 49, pd: 32, avs: 9, m5s: 6, listeOrlando: 9, fdi: 17, lega: 8, fi: 4, listeBucci: 10 },
          { name: "Marassi", csx: 54, cdx: 41, altro: 5, affluenza: 47, pd: 30, avs: 9, m5s: 6, listeOrlando: 9, fdi: 18, lega: 9, fi: 4, listeBucci: 10 }
        ];

        setData({
          datiCoalizioni,
          datiAstensionismo,
          datiCsx,
          datiCdx,
          datiPerMunicipioGrafico,
          top20UnitaUrbanistiche
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Rendering durante il caricamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Caricamento dati in corso...</p>
      </div>
    );
  }

  // Determina quali dati usare in base alla vista selezionata
  const dataToUse = selectedView === 'municipi' 
    ? data.datiPerMunicipioGrafico 
    : data.top20UnitaUrbanistiche;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Dashboard Elezioni Regionali 2024</h1>

      <Tabs defaultValue="mappa" className="w-full">
        <TabsList className="grid grid-cols-5 max-w-xl mx-auto mb-6">
          <TabsTrigger value="mappa">Mappa</TabsTrigger>
          <TabsTrigger value="coalizioni">Coalizioni</TabsTrigger>
          <TabsTrigger value="csx">CSX</TabsTrigger>
          <TabsTrigger value="cdx">CDX</TabsTrigger>
          <TabsTrigger value="affluenza">Affluenza</TabsTrigger>
        </TabsList>

        <TabsContent value="mappa">
          <Card>
            <CardHeader>
              <CardTitle>Mappa Unità Urbanistiche</CardTitle>
              <CardDescription>Colorazione per coalizione vincente o affluenza</CardDescription>
            </CardHeader>
            <CardContent>
              <MapUU />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coalizioni">
          <Card>
            <CardHeader>
              <CardTitle>Risultati per coalizione</CardTitle>
              <CardDescription>Distribuzione dei voti validi per coalizione</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.datiCoalizioni}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ nome, percentuale }) => `${nome}: ${percentuale.toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="voti"
                    nameKey="nome"
                  >
                    <Cell key="cell-0" fill={COLORS.csx} />
                    <Cell key="cell-1" fill={COLORS.cdx} />
                    <Cell key="cell-2" fill={COLORS.altro} />
                    <Cell key="cell-3" fill={COLORS.schedeBianche} stroke="#999" />
                    <Cell key="cell-4" fill={COLORS.schedeNulle} />
                  </Pie>
                  <Tooltip content={CustomPieTooltip} />
                  <Legend formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Distribuzione delle coalizioni {selectedView === 'municipi' ? 'per Municipio' : 'per Unità Urbanistica'}</CardTitle>
              <CardDescription>Percentuali di voto per CDX, CSX e Altro</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToUse}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis tickFormatter={formatPercentage} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="csx" name="CSX" stackId="a" fill={COLORS.csx} />
                  <Bar dataKey="cdx" name="CDX" stackId="a" fill={COLORS.cdx} />
                  <Bar dataKey="altro" name="Altro" stackId="a" fill={COLORS.altro} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="csx">
          <Card>
            <CardHeader>
              <CardTitle>Dettaglio CSX - Distribuzione interna</CardTitle>
              <CardDescription>Composizione della coalizione di centrosinistra (% sul totale CSX)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.datiCsx}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ nome, percentuale }) => `${nome}: ${percentuale.toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="voti"
                    nameKey="nome"
                  >
                    <Cell key="cell-0" fill={COLORS.pd} />
                    <Cell key="cell-1" fill={COLORS.avs} />
                    <Cell key="cell-2" fill={COLORS.m5s} />
                    <Cell key="cell-3" fill={COLORS.listeOrlando} />
                  </Pie>
                  <Tooltip content={CustomPieTooltip} />
                  <Legend formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Composizione del CSX {selectedView === 'municipi' ? 'per Municipio' : 'per Unità Urbanistica'}</CardTitle>
              <CardDescription>Distribuzione interna del CSX (in %)</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToUse}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis tickFormatter={formatPercentage} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="pd" name="PD" stackId="a" fill={COLORS.pd} />
                  <Bar dataKey="avs" name="AVS" stackId="a" fill={COLORS.avs} />
                  <Bar dataKey="m5s" name="M5S" stackId="a" fill={COLORS.m5s} />
                  <Bar dataKey="listeOrlando" name="Liste Orlando" stackId="a" fill={COLORS.listeOrlando} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdx">
          <Card>
            <CardHeader>
              <CardTitle>Dettaglio CDX - Distribuzione interna</CardTitle>
              <CardDescription>Composizione della coalizione di centrodestra (% sul totale CDX)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.datiCdx}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ nome, percentuale }) => `${nome}: ${percentuale.toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="voti"
                    nameKey="nome"
                  >
                    <Cell key="cell-0" fill={COLORS.fdi} />
                    <Cell key="cell-1" fill={COLORS.lega} />
                    <Cell key="cell-2" fill={COLORS.fi} />
                    <Cell key="cell-3" fill={COLORS.listeBucci} />
                  </Pie>
                  <Tooltip content={CustomPieTooltip} />
                  <Legend formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Composizione del CDX {selectedView === 'municipi' ? 'per Municipio' : 'per Unità Urbanistica'}</CardTitle>
              <CardDescription>Distribuzione interna del CDX (in %)</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToUse}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis tickFormatter={formatPercentage} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="fdi" name="FdI" stackId="a" fill={COLORS.fdi} />
                  <Bar dataKey="lega" name="Lega" stackId="a" fill={COLORS.lega} />
                  <Bar dataKey="fi" name="Forza Italia" stackId="a" fill={COLORS.fi} />
                  <Bar dataKey="listeBucci" name="Liste Bucci" stackId="a" fill={COLORS.listeBucci} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="affluenza">
          <Card>
            <CardHeader>
              <CardTitle>Affluenza alle urne</CardTitle>
              <CardDescription>Affluenza totale: {data.datiAstensionismo[0].percentuale.toFixed(2)}%</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.datiAstensionismo}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ nome, percentuale }) => `${nome}: ${percentuale.toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="voti"
                    nameKey="nome"
                  >
                    <Cell key="cell-0" fill={COLORS.votanti} />
                    <Cell key="cell-1" fill={COLORS.nonVotanti} />
                  </Pie>
                  <Tooltip content={CustomPieTooltip} />
                  <Legend formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Affluenza {selectedView === 'municipi' ? 'per Municipio' : 'per Unità Urbanistica'}</CardTitle>
              <CardDescription>Percentuale di votanti</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...dataToUse].sort((a, b) => b.affluenza - a.affluenza)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tickFormatter={formatPercentage} 
                  />
                  <Tooltip formatter={formatPercentage} />
                  <Legend />
                  <Bar dataKey="affluenza" name="Affluenza %" fill={COLORS.votanti} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Confronto Affluenza vs CSX/CDX</CardTitle>
              <CardDescription>Relazione tra affluenza e risultati per coalizione</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToUse}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis tickFormatter={formatPercentage} />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="affluenza" name="Affluenza" fill="#8884d8" />
                  <Bar dataKey="csx" name="CSX" fill={COLORS.csx} />
                  <Bar dataKey="cdx" name="CDX" fill={COLORS.cdx} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Selettore Vista */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md ${selectedView === 'municipi' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setSelectedView('municipi')}
          >
            Per Municipio
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedView === 'urbanistiche' ? 'bg-white shadow-sm' : ''}`}
            onClick={() => setSelectedView('urbanistiche')}
          >
            Per Unità Urbanistica
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riepilogo numerico</CardTitle>
          <CardDescription>Dati principali delle elezioni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="font-semibold text-lg">CSX</h3>
              <p className="text-xl font-bold">{formatNumber(data.datiCoalizioni[0].voti)}</p>
              <p>{data.datiCoalizioni[0].percentuale.toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="font-semibold text-lg">CDX</h3>
              <p className="text-xl font-bold">{formatNumber(data.datiCoalizioni[1].voti)}</p>
              <p>{data.datiCoalizioni[1].percentuale.toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="font-semibold text-lg">Altro</h3>
              <p className="text-xl font-bold">{formatNumber(data.datiCoalizioni[2].voti)}</p>
              <p>{data.datiCoalizioni[2].percentuale.toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <h3 className="font-semibold text-lg">Affluenza</h3>
              <p className="text-xl font-bold">{formatNumber(data.datiAstensionismo[0].voti)}</p>
              <p>{data.datiAstensionismo[0].percentuale.toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectionDashboard;

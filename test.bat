@echo off
echo ==========================
echo  Social Network Demo Graph
echo ==========================
echo.

REM BACKEND AYAKTA OLMALI: npm run dev (port 4000)

echo --- Nodelar ekleniyor ---

curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"1\",\"name\":\"Emre\",\"activity\":0.8,\"interaction\":0.7,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"2\",\"name\":\"Ayse\",\"activity\":0.6,\"interaction\":0.9,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"3\",\"name\":\"Mehmet\",\"activity\":0.7,\"interaction\":0.6,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"4\",\"name\":\"Zeynep\",\"activity\":0.9,\"interaction\":0.8,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"5\",\"name\":\"Ali\",\"activity\":0.5,\"interaction\":0.4,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"6\",\"name\":\"Fatma\",\"activity\":0.4,\"interaction\":0.5,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"7\",\"name\":\"Burak\",\"activity\":0.7,\"interaction\":0.9,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"8\",\"name\":\"Elif\",\"activity\":0.6,\"interaction\":0.5,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"9\",\"name\":\"Can\",\"activity\":0.3,\"interaction\":0.6,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"10\",\"name\":\"Selin\",\"activity\":0.8,\"interaction\":0.9,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"11\",\"name\":\"Murat\",\"activity\":0.6,\"interaction\":0.7,\"connectionCount\":0}"
curl -X POST "http://localhost:4000/api/graph/nodes" -H "Content-Type: application/json" -d "{\"id\":\"12\",\"name\":\"Derya\",\"activity\":0.5,\"interaction\":0.8,\"connectionCount\":0}"

echo.
echo --- Edgeler ekleniyor ---

REM Grup 1
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"1\",\"toId\":\"2\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"1\",\"toId\":\"3\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"2\",\"toId\":\"3\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"2\",\"toId\":\"4\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"3\",\"toId\":\"4\"}"

REM Grup 2
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"5\",\"toId\":\"6\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"5\",\"toId\":\"7\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"6\",\"toId\":\"7\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"6\",\"toId\":\"8\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"7\",\"toId\":\"8\"}"

REM Kopru baglantilar
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"4\",\"toId\":\"7\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"3\",\"toId\":\"6\"}"

REM Cevresel baglantilar
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"1\",\"toId\":\"9\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"9\",\"toId\":\"5\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"8\",\"toId\":\"10\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"10\",\"toId\":\"11\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"10\",\"toId\":\"12\"}"
curl -X POST "http://localhost:4000/api/graph/edges" -H "Content-Type: application/json" -d "{\"fromId\":\"11\",\"toId\":\"12\"}"

echo.
echo --- Senaryo yuklendi. ---
echo Grafi UI'den gormek icin: npm run dev (frontend) ve "Grafi Yükle" butonuna bas.
echo.
pause

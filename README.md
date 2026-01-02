# Social Network Analyzer

Bu proje, sosyal ilişkileri **graf veri yapıları** ve **graf algoritmaları** kullanarak analiz eden,  
**Node.js (TypeScript) + React (TypeScript)** tabanlı bir web uygulamasıdır.

Kullanıcılar düğümler (kişiler) ve kenarlar (ilişkiler) ekleyerek bir sosyal ağ oluşturabilir,  
oluşturulan ağ üzerinde çeşitli algoritmaları çalıştırabilir ve sonuçları görsel olarak inceleyebilir.

---

## 🚀 Kullanılan Teknolojiler

### Backend
- Node.js
- Express.js
- TypeScript
- REST API
- JSON tabanlı kalıcı veri saklama

### Frontend
- React
- TypeScript
- Vite
- SVG tabanlı grafik görselleştirme

---

## 🧠 Uygulanan Algoritmalar

- **BFS (Breadth-First Search)**
- **DFS (Depth-First Search)**
- **Dijkstra (En kısa yol)**
- **Connected Components**
- **Welsh–Powell Graph Coloring**
- **Degree Centrality**

---

## 📊 Özellikler

- Düğüm (node) ekleme
- Kenar (edge) ekleme
- Ağı JSON olarak kaydetme ve yükleme
- Algoritma sonuçlarını ham JSON olarak görüntüleme
- Grafiğin görsel (SVG) gösterimi
- Algoritma sonuçlarına göre:
  - Başlangıç / hedef düğüm vurgulama
  - Renklendirme (graph coloring)
  - Yol gösterimi

---

## ⚙️ Kurulum ve Çalıştırma

### 1️⃣ Projeyi klonla
```bash
cd social-network-analyzer

cd backend
npm install
npm run dev 

cd frontend
npm install
npm run dev


```
social-network-analyzer/
│
├── backend/
│   ├── src/
│   │   ├── algorithms/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── data/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   └── types/
│
└── README.md



# Dianpushu Organization Page (`Dianpushu.github.io`)

這裏是 [Dianpushu 組織](https://github.com/Dianpushu)的專屬公開 GitHub Pages 首頁！

👉 **線上即時首頁網址**：[https://Dianpushu.github.io](https://Dianpushu.github.io)

---

## 🌟 特色亮點 (Features) — v2.0 全面改版

1. **開機動畫 (Boot Sequence)**
   - 進站先跑一段終端機開機自檢：「載入拖延症核心模組……OK」，儀式感拉滿（同一分頁只播一次）。

2. **多層次動態背景**
   - 極光色塊 + 滑鼠互動星空粒子 + 流星 + 掃描網格 + 噪點材質，質感直逼正式產品官網。

3. **Glitch 故障感大標題**
   - 動態漸層 + 週期性 RGB 錯位故障特效，氣勢絕對不能輸。

4. **全功能模擬終端機 (`$ dianpushu-cli` v2.0)**
   - 支援 `help`, `whoami`, `neofetch`, `status`, `roadmap`, `git log`, `fortune`, `coffee` 等指令。
   - **↑↓ 指令歷史紀錄**與 **Tab 自動補全**。
   - 隱藏彩蛋：`sudo`、`hack`、`matrix`（駭客任務字雨）、`ping`、`rm -rf` ……自己挖。

5. **視覺化透明報告**
   - 滾動觸發的數據計數動畫、條紋動態進度條、發光節點時間軸 Roadmap（含無限迴圈 GOTO）。

6. **互動細節**
   - 跑馬燈標語帶、卡片滑鼠聚光燈、捲動進度條、滾動漸入動畫。
   - 傳說中的 **Konami Code**（↑↑↓↓←→←→BA）會觸發隱藏成就。

7. **嚴謹的公開訪客體驗 (Pure Public Portal)**
   - 完美承襲組織「醞釀中 (Est. 2026 · Something is brewing)」幽默精神。
   - 所有內部專案與私人資訊（Private Repo 內容）嚴格隔離，保護組織隱私。

8. **自訂 404 頁面**
   - 走錯路也有終端機儀式感：打字機重演你輸入的錯誤路徑，附上「機率 100% 不存在」的系統分析報告。

9. **品牌識別 & 社群分享預覽**
   - 漸層「D_」SVG favicon（含 PNG fallback 與 apple-touch-icon）。
   - Open Graph + Twitter Card meta 標籤與 1200×630 `og-image.png`，分享到 Discord / Facebook / LINE 會顯示精美 embed 卡片。

---

## 🛠️ 技術架構

- **純靜態 HTML5 + CSS3 + Vanilla JavaScript**：零建置流程、零框架依賴。
- **關注點分離的檔案結構**：

  ```text
  ├── index.html          # 首頁（純結構 + meta）
  ├── 404.html            # 自訂 404 頁面（GitHub Pages 自動套用）
  └── assets/
      ├── css/style.css   # 全站樣式
      ├── js/main.js      # 首頁互動邏輯
      ├── js/404.js       # 404 頁打字機效果
      ├── favicon.svg     # 主 favicon（向量）
      ├── favicon-96.png  # PNG fallback
      ├── apple-touch-icon.png
      └── og-image.png    # 社群分享預覽圖 (1200×630)
  ```
- **HTML5 Canvas ×2**：星空粒子背景與 Matrix 字雨彩蛋。
- **IntersectionObserver**：滾動漸入與計數動畫。
- **支援 `prefers-reduced-motion`**：對動畫敏感的訪客自動降級。
- **完全支援 GitHub Pages 自動部署**。

---
*Powered by Friendship, Caffeine & 100% Procrastination.*

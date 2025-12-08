# 🔑 CartKey – Controle Inteligente de Carrinhos de Condomínio

O **CartKey** é um aplicativo mobile integrado a um sistema com **ESP32 + Relé**, desenvolvido para **liberar e travar carrinhos de compras em condomínios de forma inteligente, segura e automatizada**.

O morador consegue:
- Fazer login pelo **número do apartamento e torre**
- Ver **quantos carrinhos estão disponíveis**
- **Destravar um carrinho pelo celular**
- Ver **seu próprio status**
- Indicar quando o carrinho foi **devolvido**

O sistema se comunica com um **dispositivo físico (ESP32)** que aciona a trava do carrinho por meio de um **relé**, com sinalização por **LEDs**.

---

## 🚀 Funcionalidades do App

- ✅ Login por **Apartamento + Torre**
- ✅ Exibição de carrinhos disponíveis por torre:
  - Torre Mar  
  - Torre Serra  
  - Torre Cidade
- ✅ Botão **“Destravar Carrinho”**
- ✅ Controle de **1 carrinho por morador**
- ✅ Visualização de **quem está com os carrinhos**
- ✅ Integração com **ESP32 via HTTP**
- ✅ LEDs de status:
  - 🟢 Verde → Carrinho liberado
  - 🔴 Vermelho → Carrinho travado
- ✅ Relé simulando a **trava física do carrinho**

---

## 🧱 Arquitetura do Sistema


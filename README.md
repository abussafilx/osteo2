# Osteopatia Pro | site estático

Site estático multipágina (HTML, CSS e JS, sem build) para o Dr. Anderson Santos, Costa da Caparica.
Substitui a antiga SPA em React/Vite.

## Estrutura

```
public/                  <- pasta publicada no Netlify
  index.html             início
  osteopatia/            serviço
  massagem-terapeutica/  serviço
  massagem-relaxante/    serviço
  dores-e-lesoes/        hub + hernia-discal, dor-ciatica, tendinite-e-bursite, artrose
  osteopata-almada/      página local para SEO "osteopata Almada"
  sobre/  perguntas-frequentes/  contactos/  politica-de-privacidade/
  contacto-enviado/      confirmação do formulário (noindex)
  404.html  sitemap.xml  robots.txt  site.webmanifest  favicons
  assets/css/style.css   todo o estilo (tokens no :root)
  assets/js/main.js      menu, animações, consentimento, validação
  assets/img/            imagens otimizadas + icons.svg (Phosphor)
  assets/fonts/          Manrope, self-hosted
netlify.toml             publish = "public", cabeçalhos e cache
```

## Testar localmente

```
cd public
python3 -m http.server 8000
```
Abrir http://localhost:8000 (não abrir o ficheiro direto, os ícones precisam de servidor).

## Substituir o conteúdo do repositório

Guardar o React antigo num branch e pôr o site novo no master:

```
git clone https://github.com/abussafilx/osteopatia.git && cd osteopatia
git branch legacy-react && git push origin legacy-react
git rm -rf . && git clean -fdx
# copiar para aqui o conteúdo desta pasta (public/, netlify.toml, README.md, .gitignore)
git add -A && git commit -m "Site novo: estático, SEO e conversão" && git push origin master
```

## Deploy no Netlify

1. Add new site > Import from Git > repositório `osteopatia`, branch `master`.
2. Build command: vazio. Publish directory: `public`.
3. Em Domain settings, associar o domínio e definir o redirecionamento www para o domínio principal. HTTPS é automático.
4. Em Forms, ativar notificações por email para o formulário `contacto`.
5. Depois do deploy: submeter `/sitemap.xml` no Google Search Console e atualizar a ficha do Google Business Profile com o mesmo nome, morada e telefone.

## Antes de publicar (checklist)

- [ ] **Domínio:** o site usa `https://osteopatiapro.com` em canonical, sitemap, robots, schema e Open Graph. Se for outro, substituir em todos os ficheiros (pesquisa e substituição).
- [ ] **Morada:** usada a de Contactos (nov/2025), Rua João da Costa Pinto 10. Confirmar se ainda há atendimento em Almada.
- [ ] **Texto clínico:** o Dr. Anderson deve rever FAQ e páginas de dores. Perguntas como "A osteopatia dói?" são texto novo.
- [ ] **Credenciais:** cédula profissional, registo ERS, formação e experiência (comentário na página Sobre).
- [ ] **Foto do Dr. Anderson:** `assets/img/dr-anderson.webp` tem só 287x510 px. Trocar por uma maior.
- [ ] **YouTube:** o link do canal tem um ponto no fim (`@osteopatiapro.`) e o vídeo `Uz99kFPXQUM` deve ser confirmado.
- [ ] **Política de privacidade:** rever com jurista e acrescentar NIF e denominação legal.
- [ ] **Livro de reclamações:** confirmar o link no rodapé.
- [ ] **Preços:** não aparecem no site. Mostrá-los costuma aumentar marcações.
- [ ] **Avaliações:** o widget Featurable (id mantido do site antigo) só carrega com consentimento.

## Editar

- Cores, espaçamentos e raios: variáveis no topo de `assets/css/style.css`.
- Telefone, morada e horário aparecem em vários HTML e no JSON-LD de cada página. Pesquisar o valor antigo em todo o projeto.
- As perguntas do FAQ existem como HTML e como JSON-LD (`FAQPage`) na home e em `perguntas-frequentes/`. Alterar nos dois sítios.
- Se alterar `style.css` ou `main.js`, subir o `?v=1` nos links para forçar atualização.
- Se trocar uma imagem, dar-lhe um nome novo (cache de 30 dias).

## SEO local: Almada (v2)

- Palavra-chave principal: **osteopata em Almada** + **Costa da Caparica** (a Costa da Caparica é freguesia do concelho de Almada).
- Títulos, descrições, H1 dos serviços, JSON-LD (`areaServed`, `addressLocality`) e rodapé incluem Almada.
- Página nova `/osteopata-almada/` com FAQ própria (`FAQPage`), ligada no menu, rodapé, home e sitemap.
- **Confirmar:** tempo de viagem indicado (15 a 20 min desde o centro de Almada pelo IC20) e ligação de autocarro.
- No Google Business Profile, acrescentar Almada às áreas servidas e usar "Osteopata em Almada" nas publicações.

## Conversão (v2)

- Barra fixa no telemóvel com Marcar consulta, WhatsApp e Ligar. No desktop mantém-se o botão de WhatsApp.
- Telefone visível no cabeçalho (desktop), barra de confiança por baixo do hero, CTA duplo (online + WhatsApp) e microcopy de redução de risco.
- Não foram inventadas avaliações nem números: para mostrar estrelas/nota, usar dados reais do Google.

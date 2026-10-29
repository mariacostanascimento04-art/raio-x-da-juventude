# Raio-X da Juventude

**Educação, Tecnologia e Oportunidades para o Futuro**

Projeto de análise descritiva sobre juventude brasileira, educação, inclusão digital e oportunidades de estudo e trabalho. O relatório usa indicadores informados como provenientes do IBGE/PNAD Contínua e INEP/Censo Escolar.

## Arquivos

- `index.html`, `style.css`, `script.js`: site estático responsivo, compatível com GitHub Pages.
- `data/indicadores.json`: dados, fontes, definições e limitações usados pelo site.
- `data/*.csv`: tabelas transcritas e indicadores derivados.
- `raio_x_da_juventude_colab.ipynb`: notebook com tratamento, análise, visualizações e exportação de resultados.

## Dados e limites

Os valores das tabelas foram transcritos do resumo fornecido para o projeto. Não foi possível consultar a API do IBGE nem validar os quadros originais neste ambiente. Antes da apresentação, confira os números, rótulos e definições nos documentos oficiais ligados em `data/indicadores.json`. Essa limitação está registrada no notebook e no site; os valores não são uma extração automática nem microdados.

Os universos não são intercambiáveis: internet geral refere-se a pessoas de 10 anos ou mais; estudo/trabalho, a pessoas de 15 a 29 anos; anos de estudo, a pessoas de 18 a 29 anos; banda larga, a escolas de educação infantil. O dado de conectividade escolar não descreve todas as etapas. O anúncio da CONFEST/CONFEGE aparece apenas como contextualização institucional, não como fonte estatística.

## Executar no Google Colab

1. Abra [Google Colab](https://colab.research.google.com/) e escolha **Arquivo → Fazer upload de notebook**.
2. Selecione `raio_x_da_juventude_colab.ipynb`.
3. Execute as células na ordem, de cima para baixo. As bibliotecas usuais de análise já estão disponíveis no Colab.
4. Ao final, o notebook exporta CSVs, JSON, PNGs de alta resolução e um ZIP de resultados. Baixe o pacote gerado.
5. Confira as fontes originais antes de apresentar e atualize `data/indicadores.json` e os CSVs se encontrar diferenças. O site lê os números deste JSON.

O notebook não depende de arquivos enviados pelo usuário nem faz coleta automática. Isso permite execução reproduzível; a checagem documental dos valores continua necessária.

## Testar o site localmente

Como a página carrega `data/indicadores.json` via `fetch`, use um servidor HTTP em vez de abrir o HTML diretamente. Na pasta do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

## Publicar no GitHub Pages

1. Envie os arquivos do projeto para a branch `main` do repositório, mantendo `index.html`, CSS, JavaScript e a pasta `data/` na raiz.
2. No GitHub, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**, escolha `main` e a pasta `/(root)`, e salve.
4. Aguarde o workflow do Pages concluir e acesse o endereço exibido nessa tela. Após alterações, o GitHub Pages republica o site automaticamente.

Os gráficos do site são SVGs gerados no navegador a partir do JSON; os PNGs de alta resolução exportados pelo notebook ficam disponíveis no pacote para apresentação e download.

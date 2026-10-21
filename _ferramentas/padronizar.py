"""Padroniza todas as landing pages do modelo novo. Pode rodar quantas vezes quiser: só muda o que falta.

- favicon.svg na pasta de cada cliente (se ainda não tiver): iniciais do nome (og:site_name) na cor do tema (--theme-color)
- <link> do favicon e do CSS compartilhado (/_compartilhado/lp.css) no <head> de cada página

Uso, na raiz do repositório: python3 _ferramentas/padronizar.py
"""
import glob
import html
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Layout próprio (seções escuras, botões sem WhatsApp) ou rascunho: recebem o favicon, mas não o CSS compartilhado
SEM_CSS_COMPARTILHADO = {'advocacia-gislaine-vieira', 'braco', 'gm'}

IGNORAR = {'de', 'da', 'do', 'das', 'dos', 'e', '&', '-', '|', 'dr.', 'dra.', 'advocacia', 'advogados', 'advogado',
           'advogada', 'associados', 'sociedade', 'individual', 'consultoria', 'instituto', 'escritório'}

FAVICON = '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
CSS = '<link rel="stylesheet" href="/_compartilhado/lp.css" />'


def iniciais(nome):
    palavras = [p for p in nome.split() if p.lower() not in IGNORAR]
    sigla = next((p for p in palavras if len(p) > 1 and p.isupper() and p.isalpha()), None)
    if sigla:
        return sigla[:4]
    return ''.join(p[0] for p in palavras[:2]).upper() or nome[:1].upper()


def cor_do_texto(fundo):
    hexa = fundo.lstrip('#')
    hexa = ''.join(c * 2 for c in hexa) if len(hexa) == 3 else hexa[:6]
    r, g, b = (int(hexa[i:i + 2], 16) for i in (0, 2, 4))
    return '#1a1a1a' if (0.299 * r + 0.587 * g + 0.114 * b) > 170 else '#ffffff'


def favicon(texto, fundo):
    tamanho = {1: 36, 2: 30, 3: 23, 4: 18}[len(texto)]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<rect width="64" height="64" rx="14" fill="{fundo}"/>'
        f'<text x="32" y="32" dy=".35em" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" '
        f'font-size="{tamanho}" font-weight="700" fill="{cor_do_texto(fundo)}">{html.escape(texto)}</text></svg>\n'
    )


def main():
    paginas = sorted(glob.glob(os.path.join(REPO, '*/index.html')) + glob.glob(os.path.join(REPO, '*/*/index.html')))
    clientes = {}

    for caminho in paginas:
        fonte = open(caminho).read()
        if 'section-vertical-spacing' not in fonte or 'og:site_name' not in fonte:
            continue
        cliente = os.path.relpath(caminho, REPO).split(os.sep)[0]
        nome = html.unescape(re.search(r'og:site_name" content="([^"]*)"', fonte).group(1))
        cor = re.search(r'--theme-color:\s*(#[0-9a-fA-F]{3,8})', fonte)
        # A página principal do cliente define o favicon; as subpáginas só entram se não houver principal
        if cliente not in clientes or os.path.dirname(caminho) == os.path.join(REPO, cliente):
            clientes[cliente] = (nome, cor.group(1) if cor else '#2e4950')

        novo = fonte
        faltando = [FAVICON] if 'rel="icon"' not in novo else []
        if cliente not in SEM_CSS_COMPARTILHADO and CSS not in novo:
            faltando.append(CSS)
        if faltando:
            ancora = re.search(r'\n([ \t]*)<link rel="canonical"[^>]*>', novo) or re.search(r'\n([ \t]*)<title>.*?</title>', novo, re.S)
            novo = novo[:ancora.end()] + ''.join(f'\n{ancora.group(1)}{link}' for link in faltando) + novo[ancora.end():]
            open(caminho, 'w').write(novo)
            print(f'links: {os.path.relpath(caminho, REPO)}')

    for cliente, (nome, cor) in sorted(clientes.items()):
        destino = os.path.join(REPO, cliente, 'favicon.svg')
        # Não sobrescreve: um favicon feito à mão fica; para gerar de novo, basta apagar o arquivo
        if not os.path.exists(destino):
            open(destino, 'w').write(favicon(iniciais(nome), cor))
            print(f'favicon: {cliente} ({iniciais(nome)} em {cor})')


if __name__ == '__main__':
    main()

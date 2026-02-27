# Latex Pro
This plugin is my first project in typescript. The plugin renders latex inside markdown codeblocks with label `pdfPro` using your own local installation of latex. The focus of this plugin is scientific purposes (merging the Zettelkasten system with latex). This also offers a way to save latex code in the vault (on your device) instead of a cloud service.

## Suggested use case
Latex pro is intended to be a way to save written texts in latex, possibly in the compartimentalized way zettelkasten demands. Currently, latexpro does not intend to be a replacement for any editor like overleaf and does not provide easy typesetting. Latex pro is intended for those who are serious about latex and want to give zettelkasten a shot. An intended work flow could be:
1. write summary in preferred text editor of some concept
2. dump the entire latex code in the markdown file as described
3. embed the output pdf inside the markdown file using the copy-pastable string
The output pdf currently is a standalone document with fixed width equal to the standard view-width of obsidian

# Features
- output either pdf or png
- produces deterministic hash for naming the output. This ensures no duplicate compilations execute
- cashes the outputs
- currently the plugin suggests the user embeds the produced output in the markdown file.
	- A css-styling is provided for the embedding to ensure seamlessness.
	- A copy-pastable string is provided in the output so the embedding can easily be created.
- user can input any preamble
	- it is recommended the user creates their own package containing all user defined macros, but it's not required. This is because there's only four lines in the preamble setting (obsidian limitation)
 - bibliography is possible and is made at the bottom


# Future implementations
- `\label{}`'s work as expected via some work around (e.g. obsidians makes wikilinks to labels after rendering)
- inline latex
- enable documentclass flexibility
- custom bibliography

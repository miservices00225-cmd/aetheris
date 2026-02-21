git init
   git add .
   git commit -m "feat: scaffold aetheris project structure"
   git remote add origin https://github.com/miservices00225-cmd/aetheris.git
   git branch -M main
   git push -u origin main


  Les commandes OpenSpec utiles pour le développement sont:
  1. `openspec change` - Créer des changements (features, bugs, etc.)
  2. `openspec list` - Lister les changements et specs
  3. `openspec show` - Afficher un changement ou spec
  4. `openspec view` - Dashboard interactif
  5. `openspec status` - Voir le statut de complétude
  6. `openspec validate` - Valider les changements
  7. `openspec instructions` - Obtenir des instructions détaillées pour chaque artifact
  8. `openspec archive` - Archiver un changement complété



  ┌──────────────────────────────┬─────────────────────────────────┐
  │ Commande                     │ Usage                           │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec change              │ Créer nouvelle feature/bug      │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec view                │ Dashboard interactif (À FAIRE)  │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec list                │ Lister tous les changements     │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec show [name]         │ Détails d'un changement         │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec instructions [name] │ Instructions d'implémentation   │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ 
   [name]     │ Vérifier complétude             │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec status [name]       │ Statut artifacts                │
  ├──────────────────────────────┼─────────────────────────────────┤
  │ openspec archive [name]      │ Finaliser + mettre à jour specs │
  └──────────────────────────────┴─────────────────────────────────┘

/opsx:new       Start a new change
/opsx:continue  Create the next artifact
/opsx:apply     Implement tasks
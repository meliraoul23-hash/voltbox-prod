# VoltBox — Tableaux électriques et photovoltaïques précâblés

Application e-commerce complète (Next.js 14, App Router, TypeScript) pour la vente de tableaux
électriques et photovoltaïques précâblés, avec configurateur, panier, comptes particulier /
professionnel, devis et une base pour une évolution vers une plateforme B2B.

**Ceci est une application réelle et déployable**, pas une maquette : catalogue en base de
données, panier fonctionnel, comptes utilisateurs (authentification), commandes enregistrées,
paiement Stripe réel (webhook vérifié) avec repli en mode démonstration si non configuré, emails
transactionnels (Resend), demandes de devis avec upload de fichiers, configurateur avec calcul de
prix. Elle tourne en local dès `npm install` grâce à une base SQLite embarquée, et bascule sur
PostgreSQL en production simplement en changeant `DATABASE_URL` — aucune autre modification de
code n'est nécessaire (voir "Passer en production" ci-dessous).

## Démarrage rapide (local)

```bash
npm install
cp .env.example .env          # déjà fait si vous avez reçu ce projet tel quel
npm run db:push               # crée les tables SQLite
npm run db:seed               # remplit le catalogue de démonstration
npm run dev                   # http://localhost:3000
```

Comptes de démonstration (mot de passe pour les trois : `Demo1234!`) :

| Rôle | Email |
|---|---|
| Particulier | particulier@voltbox-demo.lu |
| Professionnel (remise pro 5%) | pro@voltbox-demo.lu |
| Administrateur | admin@voltbox-demo.lu |

## Ce qui est implémenté

- **Catalogue** : accueil, 5 pages catégories (tableaux PV, tableaux électriques, matériel PV,
  matériel électrique, borne de recharge) avec filtres et recherche, fiches produits détaillées
  (caractéristiques, contenu du coffret, produits associés).
- **Configurateur** (`/configurateur`) : formulaire complet (phase, puissance, onduleur, MPPT,
  strings, batterie, parafoudre, sectionnement AC/DC, protection, marque, départs, emplacement,
  dimensions) → liste des composants, schéma de principe (SVG généré), prix indicatif, délais,
  et bouton "Demander un devis" qui reprend la configuration.
- **Panier & commande** (`/panier`) : quantités, code promo, choix du pays (LU/BE/FR/DE) et du
  mode de livraison, calcul HT / TVA / TTC, création de commande + facture (numérotée).
- **Paiement** (`lib/payments.ts`, `app/api/checkout`, `app/api/webhooks/stripe`) : intégration
  Stripe Checkout réelle. Avec `STRIPE_SECRET_KEY` renseignée, une vraie session de paiement est
  créée et la commande reste "en attente" jusqu'à confirmation par le webhook Stripe (signature
  vérifiée côté serveur — jamais de confirmation basée sur le seul retour navigateur). Sans clé
  Stripe, le site reste pleinement fonctionnel en mode démonstration (commande enregistrée comme
  "payée" immédiatement, sans transaction réelle). PayPal est préparé (variables d'environnement,
  point d'extension documenté dans `lib/payments.ts`) mais pas encore implémenté.
- **Emails transactionnels** (`lib/email.ts`, via [Resend](https://resend.com)) : confirmation de
  commande, accusé de réception de devis, notification admin de nouveau devis. Sans
  `RESEND_API_KEY`, les emails sont journalisés en console au lieu d'être envoyés — le site reste
  utilisable de bout en bout sans compte Resend.
- **Base de données double dialecte** (`lib/db/`) : SQLite en développement (zéro configuration),
  PostgreSQL en production — le dialecte actif est détecté automatiquement à partir du préfixe de
  `DATABASE_URL`, sans aucune autre modification de code (voir "Base de données" ci-dessous).
- **Comptes** (`/compte`) : inscription particulier/professionnel, connexion, tableau de bord,
  commandes, factures, devis, tarifs professionnels (remise appliquée), téléchargement des
  fiches techniques, configurations sauvegardées, commande rapide par référence interne.
- **Devis** (`/devis`, `/sur-mesure`) : formulaire avec upload de fichiers (schéma, photo, plan),
  enregistré en base avec les fichiers joints, email d'accusé de réception + notification admin.
- **Administration** (`/admin`, compte `admin@voltbox-demo.lu`) : produits (avec prix d'achat et
  marge, visibles uniquement ici), devis reçus, commandes.
- **Import / export CSV** : `npm run export:csv` et `npm run import:csv` pour synchroniser le
  catalogue (prix, stock, statut) depuis un tableur — testé avec succès sur SQLite et sur
  PostgreSQL.
- **SEO** : métadonnées par page, `sitemap.xml` et `robots.txt` générés, 3 pages dédiées aux
  requêtes ciblées (tableau photovoltaïque précâblé Luxembourg, coffret photovoltaïque précâblé,
  tableau électrique Luxembourg).
- **Avertissement réglementaire** : rappelé sur le configurateur, les fiches produits et les
  pages SEO — aucune conformité n'est affirmée automatiquement.

## Ce qui reste à faire avant une mise en production réelle

Le socle applicatif (paiement, base de données, emails) est fonctionnel et testé, y compris en
conditions PostgreSQL réelles. Ce qui reste est essentiellement des informations et décisions qui
n'appartiennent qu'à vous et ne peuvent pas être inventées :

1. **Vraies données produit** : remplacer les 14 produits de démonstration (catégorie
   `isDemo: true`, badge visible sur chaque fiche) par votre catalogue réel, vos vraies marques
   partenaires et vos vraies caractéristiques techniques validées. Le script `import:csv` permet
   de charger un catalogue réel depuis un tableur une fois prêt.
2. **Photos réelles** : les visuels actuels sont des schémas techniques générés (pas des
   photos), volontairement — remplacez-les par de vraies photos produit.
3. **Compte Stripe réel** : créer un compte Stripe, renseigner `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans `.env` (voir
   `.env.example`). Le code applicatif n'a rien de plus à faire. PayPal reste à implémenter si
   vous en avez besoin en complément (point d'extension documenté dans `lib/payments.ts`).
4. **Compte Resend réel** (ou autre fournisseur d'emails transactionnels) : renseigner
   `RESEND_API_KEY` et `EMAIL_FROM`.
5. **Coordonnées de l'entreprise** : à compléter dans `lib/site-config.ts` (adresse, TVA, RCS,
   téléphone) et dans `.env`.
6. **Hébergement et domaine réels** : voir "Hébergement" ci-dessous.

## Passer en production

### Base de données

Le projet supporte nativement deux dialectes via [Drizzle ORM](https://orm.drizzle.team/) : SQLite
en local (fichier `dev.db`, zéro configuration) et PostgreSQL en production. Le schéma logique est
défini deux fois en parallèle (`lib/db/schema.sqlite.ts` et `lib/db/schema.pg.ts`, mêmes tables et
colonnes) ; `lib/db/schema.ts` réexporte automatiquement les bonnes tables selon le dialecte actif,
et tout le reste du code applicatif (`await db.select()...`, `await db.insert()...`, etc.) est
écrit une seule fois, de façon compatible avec les deux drivers.

Pour passer en production PostgreSQL, il suffit de :

1. Créer une base PostgreSQL managée (Neon, Supabase, Railway, RDS…).
2. Renseigner `DATABASE_URL` dans `.env` au format `postgres://user:password@host:5432/dbname`
   (le dialecte est détecté automatiquement à partir de ce préfixe — voir `lib/db/dialect.ts`).
3. `npm run db:push` (crée les tables Postgres) puis `npm run db:seed` (données de démonstration —
   à sauter si vous importez directement votre vrai catalogue via `import:csv`) ou votre propre
   script d'import.

Ce chemin a été testé de bout en bout dans cet environnement (création des tables, seed, connexion,
panier, checkout démo, devis avec pièce jointe, export/import CSV, espace admin) sur une instance
PostgreSQL locale — le comportement observé est identique à celui de SQLite.

Pour des migrations SQL versionnées plutôt que le script `lib/db/push.ts` (adapté au développement
et aux déploiements simples), envisagez `drizzle-kit` en complément une fois le schéma stabilisé.

### Hébergement

L'application est un projet Next.js standard : elle se déploie sur Vercel (le plus simple),
Railway, Render, ou tout hébergeur Node.js.

1. Créer une base PostgreSQL managée (Neon, Supabase, Railway…).
2. Déployer le dépôt sur Vercel (ou équivalent) et renseigner les variables d'environnement de
   `.env.example` (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, clés Stripe, `RESEND_API_KEY`).
3. Configurer le endpoint webhook Stripe (`/api/webhooks/stripe`) dans le tableau de bord Stripe
   une fois le domaine de production connu, et reporter le secret de signature obtenu dans
   `STRIPE_WEBHOOK_SECRET`.
4. Lancer `db:push` puis `db:seed` (ou importer votre vrai catalogue via `import:csv`).
5. Configurer un nom de domaine et mettre à jour `metadataBase` dans `app/layout.tsx` ainsi que
   les URLs codées en dur dans `app/sitemap.ts` et `app/robots.ts`.

### Stockage des fichiers (devis)

Les fichiers joints aux demandes de devis sont actuellement écrits dans
`public/uploads/quotes/<id>/` sur le serveur local. Sur un hébergement sans disque persistant
(la plupart des plateformes serverless), remplacez ce stockage par un service tel que
Cloudflare R2, AWS S3 ou Vercel Blob (`app/api/quotes/route.ts`).

## Architecture

```
app/                       Pages et routes API (Next.js App Router)
  produit/[slug]/          Fiche produit dynamique
  configurateur/           Configurateur de tableau
  compte/                  Espace installateur (comptes, commandes, devis, tarifs…)
  admin/                   Mini back-office (produits, devis, commandes)
  seo/                     Pages dédiées SEO
  api/                     Routes API (checkout, webhook Stripe, devis, comptes, configurations…)
components/                Composants React réutilisables
lib/
  db/                      Schémas Drizzle (SQLite + PostgreSQL), connexion, push, seed
  data/products.ts         Accès aux données produits (server-only)
  configurator.ts          Logique du configurateur (calcul prix/composants/délais)
  delivery.ts               Zones et tarifs de livraison
  payments.ts                Intégration Stripe Checkout + webhook, point d'extension PayPal
  email.ts                   Emails transactionnels (Resend), avec repli démo sans clé
  pricing.ts                 Calcul du prix applicable selon le type de compte
  site-config.ts              Identité du site, coordonnées, avertissements légaux
scripts/                   Scripts CLI d'import/export CSV du catalogue
```

### Note technique : pourquoi Drizzle plutôt que Prisma

Ce projet a été développé dans un environnement dont l'accès réseau sortant est limité par une
politique de sécurité qui bloque `binaries.prisma.sh` (téléchargement des moteurs binaires de
Prisma). Drizzle ORM a été choisi à la place : aucune dépendance à un binaire téléchargé à
l'installation, comportement identique en production, et double support SQLite/PostgreSQL natif
sans changement de code applicatif. Si vous préférez Prisma dans votre environnement de
déploiement (où cet accès réseau n'est pas restreint), la migration est directe : le schéma de
données (`lib/db/schema.pg.ts`) sert de référence pour recréer un `schema.prisma` équivalent.

## Personnalisation rapide

- **Nom, slogan, couleurs de marque** : `lib/site-config.ts` et `tailwind.config.ts` (tokens
  `ink`, `steel`, `volt`).
- **Catalogue** : `lib/db/seed.ts` (ou l'import CSV une fois en production).
- **Formule de prix du configurateur** : `lib/configurator.ts`.
- **Taux de TVA / zones de livraison** : `lib/site-config.ts` et `lib/delivery.ts`.

# TD API REST JSON et Chat

## Livrables

### Livrables API REST JSON

L’API est reliée à une base de données MongoDB et manipule la collection `users`.

#### Partie authentification

##### Route POST /auth/signup

Inscrire un utilisateur et lui attribuer les propriétés :
1. `name`,
1. `role` qui peut être soit `'admin'`, soit `'member'`,
1. `hash`,
1. `salt`.

##### Route POST /auth/signin

Authentifier un utilisateur à partir de :
1. son `name`,
1. de son `password` que l’API sale pour vérifier si son hash correspond à celui stocké en base de données,

Si l’authentification a réussi, l’API lui un JSON Web Token.

#### Partie admin

#### GET /admin

Obtenir la liste de tous les utilisateurs.

Cette route n’est accessibles qu’aux utilisateurs ayant le rôle `admin`.

Les données obtenues contiennent pour chaque utilisateur :
1. son `_id`,
1. son `name`,
1. son `role`.

#### GET /admin/:_id

Obtenir les données d’un utilisateur à partir de son `_id`. L’API ne retourne que :
1. `_id` de l’utilisateur,
1. `name` de l’utilisateur,
1. `role` de l’utilisateur.

Cette route n’est accessible :
1. qu’au utilisateurs ayant le rôle `admin`,
1. et à l’utilisateur ayant le rôle `member` et l’`_id` recherché.

#### PUT /admin/_:id

Modifier les données d’un utilisateur à partir de son `_id` et API retourne que :
1. `_id` de l’utilisateur,
1. l’éventuel nouveau `name` de l’utilisateur,
1. l’éventuel nouveau `role` de l’utilisateur.

Cette route n’est accessible :
1. qu’au utilisateurs ayant le rôle `admin`,
1. et à l’utilisateur ayant le rôle `member` et l’`_id` recherché.

#### DELETE /admin/_:id

Supprimer un utilisateur à partir de son `_id`. L’API retourne :
1. `_id` de l’utilisateur supprimé,
1. `name` de l’utilisateur supprimé,
1. `role` de l’utilisateur supprimé.

Cette route n’est accessible :
1. qu’au utilisateurs ayant le rôle `admin`,
1. et à l’utilisateur ayant le rôle `member` et l’`_id` recherché.

### Livrables Chat

(À venir)

## Livraison

(À venir)

## Barême de notation

(À venir)



# Migration `20200819102122-init`

This migration has been generated by Khanh Le at 8/19/2020, 5:21:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" text   NOT NULL ,
"email" text   NOT NULL ,
"password" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200819102122-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,15 @@
+generator prisma_client {
+    provider        = "prisma-client-js"
+    previewFeatures = ["transactionApi", "connectOrCreate", "insensitiveFilters"]
+}
+
+datasource db {
+    provider = "postgres"
+    url = "***"
+}
+
+model User {
+    id               String    @id @default(uuid())
+    email            String    @unique
+    password         String
+}
```



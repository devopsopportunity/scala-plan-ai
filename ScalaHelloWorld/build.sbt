name := "scala-web-project"

version := "0.1"

scalaVersion := "3.6.2"

// Aggiungi dipendenze per http4s
libraryDependencies ++= Seq(
  "org.http4s" %% "http4s-dsl" % "0.23.14",         // Http4s DSL per definire gli endpoint
  "org.http4s" %% "http4s-blaze-server" % "0.23.14", // Server HTTP
  "org.http4s" %% "http4s-circe" % "0.23.14",        // Circe per il supporto JSON
  "org.typelevel" %% "cats-effect" % "3.5.1"          // Supporto per effetti funzionali
)

// Aggiungi dipendenza per logging con SLF4J
libraryDependencies += "org.slf4j" % "slf4j-simple" % "2.0.0"


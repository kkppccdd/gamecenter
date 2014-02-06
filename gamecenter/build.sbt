name := "gamecenter"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.3.0",
  jdbc,
  anorm,
  cache
)     

play.Project.playScalaSettings

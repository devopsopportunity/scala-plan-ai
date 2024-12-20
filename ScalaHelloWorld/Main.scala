import org.http4s._
import org.http4s.dsl.io._
import org.http4s.blaze.server._
import org.http4s.server.Router
import cats.effect._
import scala.concurrent.ExecutionContext.Implicits.global

object Main extends IOApp {

  // Definisci un endpoint per la home page
  val helloWorldService: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root => Ok("Hello, Scala!")
  }

  // Combinazione del servizio con il router
  val httpApp: HttpApp[IO] = Router(
    "/" -> helloWorldService
  ).orNotFound

  // Avvio del server
  override def run(args: List[String]): IO[ExitCode] = {
    BlazeServerBuilder[IO](global)
      .withHttpApp(httpApp)
      .bindHttp(8080, "0.0.0.0") // Porta 8080
      .serve
      .compile
      .drain
      .as(ExitCode.Success)
  }
}

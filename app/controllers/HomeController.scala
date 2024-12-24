package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import java.io.File  // Importa la classe File per lavorare con i file
import java.io.IOException
import scala.io.Source  // Importa Source per leggere i file

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
 // Metodo per la home page
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  // Endpoint About
  def about() = Action {
    Ok(views.html.about())
  }

  // Endpoint per il menu
  def menu() = Action { implicit request =>
    Ok(views.html.index())
  }

 def visualizzaLog(nomeFile: String) = Action { implicit request =>
  val referer = request.headers.get("Referer").getOrElse(routes.HomeController.menu().url)
  val baseUrl = routes.HomeController.menu().absoluteURL()
  
  // Estrai la parte relativa dalla Referer rimuovendo la base URL
  val relativePath = referer.stripPrefix(baseUrl)
  
  // Ottieni solo l'ultima parte del path (es. "log-passati")
  val lastSegment = relativePath.split("/").lastOption.getOrElse("menu")

  println(s"Ultimo segmento: $lastSegment")

  val projectRootPath = System.getProperty("user.dir")
  val logDirectoryPath = s"$projectRootPath/public/mylogs/"
  val filePath = logDirectoryPath + "/" + lastSegment + "/" + nomeFile
  
   if (new java.io.File(filePath).exists()) {
     val fileContent = scala.io.Source.fromFile(filePath).getLines().mkString("\n")
     Ok(views.html.visualizzaLog(fileContent, referer))
   } else {
    Ok(views.html.visualizzaLog(s"Errore: Il file '$nomeFile' non esiste.", referer))
   }
  }

  // Funzione per mostrare i log correnti
  def logCorrente() = Action { implicit request =>
    Ok(views.html.logCorrente())
  }

// Funzione generica per mostrare i log
def mostraLog(tipo: String) = Action { implicit request =>
    val projectRootPath = System.getProperty("user.dir")
    val logDirectoryPath = s"$projectRootPath/public/mylogs/$tipo"
    
    val folder = new File(logDirectoryPath)
    
    if (!folder.exists()) {
        folder.mkdirs()
        val message = s"Cartella '$logDirectoryPath' creata con successo."
        tipo match {
            case "log-passati" => Ok(views.html.logPassati(message, List())) // Log passati
            case "log-futuri" => Ok(views.html.logFuturi(message, List()))  // Log futuri
        }
    } else {
        var message = s"La cartella '$logDirectoryPath' contiene: "
        var fileList = List[String]() // Lista per i file trovati
        
        if (folder.isDirectory) {
            val logFiles = folder.listFiles().filter(_.getName.endsWith(".yaml"))
            if (logFiles.nonEmpty) {
                fileList = logFiles.map(_.getName).toList
                message += s"File trovati: ${fileList.mkString(", ")}."
            } else {
                message += "Nessun file YAML trovato."
            }
        } else {
            message += s"Errore inatteso su cartella '$logDirectoryPath'."
        }
        
        tipo match {
            case "log-passati" => Ok(views.html.logPassati(message, fileList)) // Log passati
            case "log-futuri" => Ok(views.html.logFuturi(message, fileList))  // Log futuri
        }
    }
}

  // Funzione per log passati
  def logPassati() = mostraLog("log-passati")

  // Funzione per log futuri
  def logFuturi() = mostraLog("log-futuri")

}

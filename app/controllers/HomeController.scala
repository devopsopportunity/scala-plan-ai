package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import scala.io.Source  // Importa Source per leggere i file

import java.io.{File, FileWriter, IOException}

import java.util.Locale
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import org.yaml.snakeyaml.{DumperOptions, Yaml}
import org.yaml.snakeyaml.DumperOptions.FlowStyle

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

    def saveActivities() = Action(parse.tolerantText) { request =>
      request.contentType match {
        case Some("application/yaml") =>
          try {
            val yamlData = request.body
            val data = new Yaml().load(yamlData).asInstanceOf[java.util.Map[String, Any]]

            if (data.containsKey("activities")) {
              val now = LocalDateTime.now()

              // Formatta la data e l'ora come 'yyyy-MM-dd HH:mm' per il nome del file
              val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
              val fileName = s"activities-${now.format(dateFormatter)}.yaml"
              
              // Definisce la variabile 'day' come la data odierna
              val day = now.toLocalDate.toString

              // Definisce il percorso della cartella per l'anno e mese corrente
              val baseFolderPath = s"${System.getProperty("user.dir")}/public/mylogs"
              val yearFolderPath = s"$baseFolderPath/Year ${now.getYear}"
              val monthFolderPath = s"$yearFolderPath/${now.format(DateTimeFormatter.ofPattern("MMMM", Locale.ENGLISH))}"

              // Crea automaticamente le cartelle mancanti (mylogs, Year, Mese)
              val monthFolder = new File(monthFolderPath)
              monthFolder.mkdirs()  // Crea la cartella se non esiste, inclusi eventuali genitori

              // Crea il file dentro la cartella del mese
              val file = new File(s"$monthFolderPath/$fileName")
              val writer = new FileWriter(file)

              // Prepara la struttura dei dati da salvare nel file YAML
              val resultMap = new java.util.LinkedHashMap[String, Any]()
              val promptITA = "Ecco il mio piano. Puoi darmi un'analisi sullo stato attuale e suggerire come migliorare la gestione delle attività rimanenti?"
              resultMap.put("fileName", fileName)
              resultMap.put("prompt", promptITA)
              resultMap.put("day", day)  // giorno pianificato
              resultMap.put("activities", data.get("activities"))

              // Scrivi i dati nel file YAML
              val yamlWriter = new Yaml(new DumperOptions() {
                setDefaultFlowStyle(FlowStyle.BLOCK)
              })

              yamlWriter.dump(resultMap, writer)
              writer.close()

              Ok(s"Activities saved successfully as: mylogs/Year ${now.getYear}/${now.format(DateTimeFormatter.ofPattern("MMMM", Locale.ENGLISH))}/$fileName\n")
            } else {
              BadRequest("The field 'activities' is missing. Please provide a valid YAML structure for ScalaPlanAI.\n")
            }
          } catch {
            case e: Exception =>
              BadRequest(s"Error during YAML parsing: ${e.getMessage}\n")
          }

        case _ =>
          BadRequest("The MIME type is not the new standard RFC 9512 expected for YAML (application/yaml). Expected MIME type: application/yaml.\n")
      }
    }
}

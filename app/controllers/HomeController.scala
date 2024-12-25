package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import java.io.{File, FileWriter}
import java.io.IOException
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import scala.io.Source  // Importa Source per leggere i file

import org.yaml.snakeyaml.Yaml
import org.yaml.snakeyaml.DumperOptions
import org.yaml.snakeyaml.DumperOptions.Version

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
    // Verify content type
    request.contentType match {
      case Some("application/yaml") =>
        try {
          // Get the request body
          val yamlData = request.body

          // Create Yaml instance and load the content
          val yaml = new Yaml()

          // Parse YAML content into a Map
          val data = yaml.load(yamlData).asInstanceOf[java.util.Map[String, Any]]

          // Check if 'activities' and 'folderType' are present
          if (data.containsKey("activities") && data.containsKey("folderType")) {
            
            val activities = data.get("activities")
            val folderType = data.get("folderType")

            // Generate file name and path based on folder type and current date
            val now = LocalDateTime.now()
            val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm")
            val dateString = now.format(dateFormatter)
            val fileName = s"activities-${folderType}-$dateString.yaml"

            // Determine the folder where to save the file (based on folderType)
            val projectRootPath = System.getProperty("user.dir")
            val folderPath = s"$projectRootPath/public/mylogs/$folderType"
            val folder = new File(folderPath)

            // Create the folder if it doesn't exist
            if (!folder.exists()) {
              folder.mkdirs()
            }

            // Create a file object
            val file = new File(s"$folderPath/$fileName")
            val writer = new FileWriter(file)

            // Prepare the content for YAML format using LinkedHashMap
            val resultMap = new java.util.LinkedHashMap[String, Any]()

            // Format the current date and time as "Today 23/12/2024 at 10:22"
            val formattedDate = now.format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'at' HH:mm"))
            resultMap.put("title", s"Today $formattedDate")

            // Now put the fileName
            resultMap.put("fileName", folderType + "/" + fileName)

            // Now put the activities
            resultMap.put("activities", activities)

            // Create YAML writer with custom formatting
            val dumperOptions = new DumperOptions()
            dumperOptions.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK)
            val yamlWriter = new Yaml(dumperOptions)

            // Write the YAML content to the file
            yamlWriter.dump(resultMap, writer)

            writer.close()

            // Respond with a success message
            Ok(s"Activities saved successfully as: mylogs/$folderType/$fileName\n")
          } else {
            // Respond with an error if 'activities' or 'folderType' is missing
            BadRequest("The fields 'activities' or 'folderType' are missing. Please provide a valid YAML structure for ScalaPlanAI.\n")
          }
        } catch {
          case e: Exception =>
            BadRequest(s"Error during YAML parsing: ${e.getMessage}\n")
        }
      case _ =>
        // If the MIME type is incorrect, return an informative message
        BadRequest("The MIME type is not the new standard RFC 9512 expected for YAML (application/yaml). This standard was introduced on February 14, 2024 ❤️. Expected MIME type: application/yaml.\n")
    }
  }

}

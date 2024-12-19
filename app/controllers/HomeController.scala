package controllers

import javax.inject._
import play.api._
import play.api.mvc._

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
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  /* 
   * primo metodo in scala! wow chat! sono emozionato!!! 
   * ma che roba e'? un incrocio Java-Python? ahhahahahah
   * ci divertiremo tantissimo!!!!!!!! ma che figata!!!!!!
   * ******************************************************
  */
  def about() = Action {
    Ok(views.html.about())
  }
  
 def menu() = Action { implicit request =>
    Ok(views.html.index())
}

def logPassati() = Action { implicit request =>
    Ok(views.html.logPassati())
}

def logCorrente() = Action { implicit request =>
    Ok(views.html.logCorrente())
}

def logFuturi() = Action { implicit request =>
    Ok(views.html.logFuturi())
}

}

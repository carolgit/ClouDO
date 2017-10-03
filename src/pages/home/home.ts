import { Component } from "@angular/core";
import { NavController, AlertController } from 'ionic-angular';
import { TodosProvider } from '../../providers/todos/todos';
import {Camera} from '@ionic-native/camera';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  todos: any;
  public base64Image: string;
 
  constructor(public navCtrl: NavController, public todoService: TodosProvider, public alertCtrl: AlertController, public camera: Camera) {
    this.ionViewDidLoad();
  }

 
 ionViewDidLoad(){
 
    this.todoService.getTodos().then((data) => {
      this.todos = data;
    });
 
  }
 
  createTodo(){
 
    let prompt = this.alertCtrl.create({
      title: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.createTodo(
            {
              _id:new Date().toISOString(),
              title: data.title
            });
          }
        }
      ]
    });
 
    prompt.present();
 
  }
 
  updateTodo(todo){
 
    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.updateTodo({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title
            });
          }
        }
      ]
    });
 
    prompt.present();
  }
 
  deleteTodo(todo){
    this.todoService.deleteTodo(todo);
  }


  //Imagem
  takePicture(todo){
    this.camera.getPicture({
        destinationType:  this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.attach(todo, imageData);
    }, (err) => {
        console.log(err);
    });
  }
 

  attach(todo, picture){
 
    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.updateTodo({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title,
               _attachments: {
                'photo.jpeg': {
                  content_type: 'image/jpeg',
                  data: picture
                }
              }
            });
          }
        }
      ]
    });
 
    prompt.present();
  } 
}
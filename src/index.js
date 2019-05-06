import React from "react";
import { render } from "react-dom";
import { Route } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import {
Stitch,
RemoteMongoClient,
GoogleRedirectCredential,
FacebookRedirectCredential,
BSON
} from "mongodb-stitch-browser-sdk";

require("../static/todo.scss");


let appId = "aplicacion-jdxoa";

const client = Stitch.initializeDefaultAppClient(appId);

const db = client.getServiceClient(RemoteMongoClient.factory, 
   "mongodb-atlas").db('Prodep');

let TodoItem = class extends React.Component {
   clicked() {
      this.props.onStartChange();
      this.props.items
         .updateOne(
         { _id: this.props.item._id },
         { $set: { checked: !this.props.item.checked } }
         )
         .then(() => this.props.onChange());
   }

render() {
   let itemClass = this.props.item.checked ? "done" : "";
   return (
      <div className="todo-item-root">
      <label className="todo-item-container" onClick={() => this.clicked()}>
         {this.props.item.checked
            ? <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               height="24"
               viewBox="0 0 24 24"
               width="24"
            >
               <path d="M0 0h24v24H0z" fill="none" />
               <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            : <svg
               fill="#000000"
               height="24"
               viewBox="0 0 24 24"
               width="24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
               <path d="M0 0h24v24H0z" fill="none" />
            </svg>}
         <span className={"todo-item-text " + itemClass}>
            {this.props.item.text}
         </span>
      </label>
      </div>
   );
}
};

var AuthControls = class extends React.Component {
   constructor(props){
      super(props)
      this.state = {userData:null}
      this.client = props.client;
   }

render() {

   let authed = this.client.auth.isLoggedIn;

   if(client.auth.hasRedirectResult()){
      client.auth.handleRedirectResult().then(user=>{
         this.setState({userData:user.profile.data})
      });
   }
   let logout = () => this.client.auth.logout().then(() => location.reload());
   return (
      <div>
      {authed
         ? <div className="login-header">Hola 
            {this.state.userData && this.state.userData.picture
                ? <img src={this.state.userData.picture} className="profile-pic" />
               : null}
            <span className="login-text">
               <span className="username">
                  {this.state.userData && this.state.userData.name ? this.state.userData.name : "?"}
               </span>
            </span>
            <div>
               <a className="logout" href="#" onClick={() => logout()}>
                  Finalizar sesión
               </a>
            </div>
            <div>
               <a className="settings" href="/settings">Configuraciones</a>
            </div>
	    <div>
               <a className="help" href="mailto:a13003431@alumnos.uady.mx?subject=Questions&body=Escribe aquí si tienes preguntas">Preguntas aquí</a>
            </div>
            <div class="txtPresentaMenu" align="right">Base de datos
    	    <hr/>
    	    <div className="itemsMenu" align="right">
		<a href="#">Inicio</a> | <a href="/Profesor.html">Profesor</a> | <a href="/Universidad.html">Universidad</a> | <a href="/Trabajos.html">Trabajos</a>
    	    </div>
	    </div>
	    </div>
         : null}
      {!authed
         ? <div className="login-links-panel">
            <h2>Inicio de sesión</h2>
	         <h3>Por favor seleccione un método para iniciar sesión.</h3>
	         <h4>AVISO: El acceso solo se puede por Facebook. No lo intente por Google. Gracias por su comprensión</h4>
            <div
               onClick={() => this.client.auth.loginWithRedirect(new GoogleRedirectCredential())}
               className="signin-button"
            >
               <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  viewBox="0 0 48 48"
               >
                  <g>
                  <path
                     fill="#EA4335"
                     d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                     fill="#4285F4"
                     d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                     fill="#FBBC05"
                     d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                     fill="#34A853"
                     d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                  </g>
               </svg>
               <span className="signin-button-text"><del>Sign in with Google</del></span>
            </div>
            <div
               onClick={() => this.client.auth.loginWithRedirect(new FacebookRedirectCredential())}
               className="signin-button"
            >
               <div className="facebook-signin-logo" />
               <span className="signin-button-text">
                  Iniciar sesión con Facebook
               </span>
            </div>
            </div>
         : null}
      </div>
   );
}
};

var ProfesorList = class extends React.Component {
   loadList() {
      if (!this.client.auth.isLoggedIn) {
         return;
      }
      let obj = this;
      this.items.find({}, {limit: 1000}).asArray().then(docs => {
         obj.setState({ items: docs, requestPending: false });
      });
   }

constructor(props) {
   super(props);

   this.state = {
      items: []
   };
   this.client = props.client;
   this.items = props.items;
}

componentWillMount() {
   this.loadList();
}

checkHandler(id, status) {
   this.items.updateOne({ _id: id }, { $set: { checked: status } }).then(() => {
      this.loadList();
   }, { rule: "checked" });
}

componentDidMount() {
   this.loadList();
}

addItem(event) {
   if (event.keyCode != 13) {
      return;
   }
   this.setState({ requestPending: true });
   this.items
      .insertOne(this.setState.items)
      .then(() => {
      this._newitem.value = "";
      this.loadList();
      });
}

clear() {
   this.setState({ requestPending: true });
   this.items.deleteMany({ checked: true }).then(() => {
      this.loadList();
   });
}

setPending() {
   this.setState({ requestPending: true });
}

render() {
   let loggedInResult = (
      <div>
      <div className="meterProfe">
      <form onSubmit={e => this.addItem(e)}>
      <div>
        <label for="nombre">Nombre:</label>
        <input type="text" className="meterProfe" value={this.state.nombre} name="nombre" 
        onChange={(ev) => { this.setState({ items: { ...this.state.form, nombre: ev.target.value } }) }}/>
      </div>
      <div>
        <label for="primerApellido">Primer Apellido:</label>
        <input type="text" className="meterProfe" value={this.state.primerApellido} name="primerApellido" />
      </div>
      <div>
        <label for="segundoApellido">Segundo Apellido:</label>
        <input type="text" className="meterProfe" value={this.state.segundoApellido} name="segundoApellido" />
      </div>
      <div>
        <label for="sexo">Sexo:</label>
        <select className="meterProfe" value= {this.state.sexo} name="sexo">
		      <option>Masculino</option>
		      <option>Femenino </option>
	      </select>
      </div>
      <div>
        <label for="fechaNacimiento">Fecha de Nacimiento:</label>
        <input type="date" className="meterProfe" value={this.state.fechaNacimiento} name="fechaNacimiento" min="1900-01-01" max="2100-12-31"/>
      </div>
      <div>
        <label for="estadoCivil">Estado Civil:</label>
        <select className="meterProfe" value={this.state.estadoCivil} name="estadoCivil">
		      <option>Soltero</option>
		      <option>Casado </option>
            <option>Divorciado</option>
		      <option>Viudo </option>
	      </select>
      </div>
      <div>
        <label for="telCasa">Teléfono de casa:</label>
        <input type="text" className="meterProfe" value={this.state.telCasa} name="telCasa" />
      </div>
      <div>
        <label for="telTrabajo">Teléfono de trabajo:</label>
        <input type="text" className="meterProfe" value={this.state.telTrabajo} name="telTrabajo" />
      </div>
      <div>
        <label for="fax">Fax:</label>
        <input type="text" className="meterProfe" value={this.state.fax} placeholder="En caso de no contar con fax, colocar No aplica" name="fax" />
      </div>
      <div>
        <label for="correoPersonal">Correo Personal:</label>
        <input type="email" className="meterProfe" value={this.state.correoPersonal} name="orreoPersonal" />
      </div>
      <div>
        <label for="correoAcademic">Correo Académico:</label>
        <input type="email" className="meterProfe" value={this.state.correoAcademic} name="correoAcademic" />
      </div>  
      <div class="button">
        <button type="submit" onClick={event => this.addItem}>Enviar datos del profesor</button>
      </div>
      </form>        
         
         <input
            type="text"
            className="new-item"
            placeholder="Profesor"
            ref={n => {
            this._newitem = n;
            }}
            onKeyDown={e => this.addItem(e)}
         />
         {this.state.items.filter(x => x.checked).length > 0
            ? <div
               href=""
               className="cleanup-button"
               onClick={() => this.clear()}
            >
               Borrar elemento(s)
            </div>
            : null}
      <div className="">

      </div>
      </div>
     <ul className="items-list">
         {this.state.items.length == 0
            ? <div className="list-empty-label">Lista vacía</div>
            : this.state.items.map(item => {
               return (
                  <TodoItem
                  key={item._id.toString()}
                  item={item}
                  items={this.items}
                  onChange={() => this.loadList()}
                  onStartChange={() => this.setPending()}
                  />
               );
            })}
      </ul>
      </div>
   );
   return this.client.auth.isLoggedIn ? loggedInResult : null;
}
};

var Home = function(props) {
return (
   <div>
      <AuthControls {...props}/>
      <ProfesorList {...props}/>
   </div>
);
};

var AwaitVerifyCode = class extends React.Component {
checkCode(e) {
   let obj = this;
   if (e.keyCode == 13) {
      this.props.users
      .updateOne(
         { _id: this.props.client.auth.authInfo.userId, verify_code: this._code.value },
         { $set: { number_status: "verified" } }
      )
      .then(data => {
         obj.props.onSubmit();
      });
   }
}

render() {
   return (
      <div>
      <h3>Enter the code that you received via text:</h3>
      <input
         type="textbox"
         name="code"
         ref={n => {
            this._code = n;
         }}
         placeholder="verify code"
         onKeyDown={e => this.checkCode(e)}
      />
      </div>
   );
}
};

let formatPhoneNum = raw => {
let number = raw.replace(/\D/g, "");
let intl = (raw[0] === "+");
return intl ? "+" + number : "+1" + number;
};

let generateCode = len => {
let text = "";
let digits = "0123456789";
for (var i = 0; i < len; i++) {
   text += digits.charAt(Math.floor(Math.random() * digits.length));
}
return text;
};

var NumberConfirm = class extends React.Component {
saveNumber(e) {
   if (e.keyCode == 13) {
      if (formatPhoneNum(this._number.value).length >= 10) {
      let code = generateCode(7);
      console.log(this._number.value, code)
      this.props.client
         .callFunction("sendConfirmation", [this._number.value, code])
         .then(data => {
            this.props.users
            .updateOne(
               { _id: this.props.client.auth.authInfo.userId, number_status: "unverified" },
               {
                  $set: {
                  phone_number: formatPhoneNum(this._number.value),
                  number_status: "pending",
                  verify_code: code
                  }
               }
            )
            .then(() => {
               this.props.onSubmit();
            });
         })
         .catch(e => {
            console.log(e);
         });
      }
   }
}

render() {
   return (
      <div>
      <div>Número telefónico:</div>
      <input
         type="textbox"
         name="Número telefónico"
         ref={n => {
            this._number = n;
         }}
         placeholder="Coloque el número telefónico"
         onKeyDown={e => this.saveNumber(e)}
      />
      </div>
   );
}
};
var Settings = class extends React.Component {
constructor(props) {
   super(props);
   this.state = {
      user: null
   };
   this.client = props.client;
   this.users = props.users;
}
initUserInfo() {
   return this.users
      .updateOne(
      { _id: this.client.auth.user.id },
      { $setOnInsert: { phone_number: "", number_status: "unverified" } },
      { upsert: true }
      )
};
loadUser() {
   this.users.find({_id: this.client.auth.user.id}, null).asArray().then(data => {
      if (data.length > 0) {
      this.setState({ user: data[0] });
      }
   });
}
componentWillMount() {
   this.initUserInfo()
   .then (() => this.loadUser())
}
render() {
   return (
      <div>
      <h2>Configuraciones</h2>
      <Link to="/">Listas</Link>
      {(u => {
         if (u != null) {
            if (u.number_status === "pending") {
            return <AwaitVerifyCode onSubmit={() => this.loadUser()} client={this.client} users={this.users} />;
            } else if (u.number_status === "unverified") {
            return <NumberConfirm onSubmit={() => this.loadUser()} client={this.client} users={this.users} />;
            } else if (u.number_status === "verified") {
            return (
               <div
               >{`Your number is verified, and it's ${u.phone_number}`}</div>
            );
            }
         }
      })(this.state.user)}
      </div>
   );
}
};

let items = db.collection("Profesor");
let areas = db.collection("area");
let ca = db.collection("cuerpoAcademic");
let des = db.collection("des"); //DES: Dependencia de Educacion Superior
let discipline = db.collection("disciplina");
let grades = db.collection("estudio");
let ies = db.collection("ies"); //IES: Instituto de Educación Superior
let individualizada = db.collection("individualizada");
let investigation = db.collection("investigacion");
let io = db.collection("io");
let laboral = db.collection("laboral"); 
let users = db.collection("users");
let props = {client, items, users};

render(
<BrowserRouter>
   <div>
      <Route exact path="/" render={routeProps => <Home {...props} {...routeProps}/>}/>
      <Route path="/settings" render={routeProps => <Settings {...props} {...routeProps}/>}/>
   </div>
</BrowserRouter>,
document.getElementById("app")
);

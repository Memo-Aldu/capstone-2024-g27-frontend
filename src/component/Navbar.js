import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
  } from 'cdbreact';
  import { NavLink } from 'react-router-dom';

/*
* Cette page est le navbar principale
* l'ajout de {children} en parametre et de <main>{children}</main> permet
* d'afficher la navbar a gauche de la page sans pousser tout le contenu en bas de la navbar
*/
const Navbar = ({children}) =>{

    return(
        
      /* 
        ce modèle de navbar est appelé sidebar
        il contient sidebarheader pour l'entete, sidebarcontent pour le contenu 
        et sidebarfooter pour le pied de page
        L'entete contiendra le logo ou le nom de l'app 
          (inserer le nom de l'app dans la partie <a href="/"> ICI </a>)
        le contenu sera Home, messaging et contact management
        le footer contiendra les trois icones présent dans le footer du schema effectué par mohamed
      */
      <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>

        <CDBSidebar textColor="#fff" backgroundColor="#333">
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
              logo choisi sera ici
            </a>
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>

              <NavLink to="/" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
              </NavLink>

              <NavLink to="/ContactManagement" activeClassName="activeClicked">
                  <CDBSidebarMenuItem icon="user">Contact Management</CDBSidebarMenuItem>
              </NavLink>

              <NavLink to="/Messaging" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="comments">Messaging</CDBSidebarMenuItem>
              </NavLink>

              <NavLink
                exact
                to="/hero404"
                target="_blank"
                activeClassName="activeClicked"
              ></NavLink>
              
            </CDBSidebarMenu>
          </CDBSidebarContent>

          <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div
              style={{
                padding: '20px 5px',
              }}
            >
              Sidebar Footer
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>
      <main>{children}</main>
    </div>
    )
}
export default Navbar;
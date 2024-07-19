import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const SideMenu = ({ menuItems }) => {


  const location = useLocation();
  
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname)

  const handleMenuItemClick = (menuItemUrl) => {
    setActiveMenuItem(menuItemUrl);
  };

  return (
    <div className="list-group mt-2 mt-md-3 mt-lg-5 pl-4">
      {menuItems?.map((menuItem, index) => (
        <Link
          key={index}
          to={menuItem.url}
          className={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(menuItem.url) ? "active" : ""}`}
          onClick={() => handleMenuItemClick(menuItem.url)}
          aria-current={activeMenuItem.includes(menuItem.url) ? "true" : false}
        >
          <i className={`${menuItem.icon} fa-fw pe-2`}></i> {menuItem.name}
        </Link>
      ))}
      
    </div>
  )
}

export default SideMenu

{/* <a
  href="menu-item-url-2"
  className="fw-bold list-group-item list-group-item-action active"
  aria-current="true"
>
  <i className="menu-item-icon-2 fa-fw pe-2"></i> Menu Item 2
</a> */}
export default function events(){
	  // 매뉴 버튼 동작
	  const menuButton = document.getElementById('menuIcon');
	  const menu = document.getElementById('menu');
	  const closeButton = document.getElementById('closeButton');
	  const menu1 = document.getElementById('menu1');
	  const menu1Sub = document.getElementById('menu1-sub');
	  if(menuButton && menu && closeButton){
	      menuButton.addEventListener('click', () => {
		  menuButton.classList.toggle('open');
		      menu.classList.toggle('show');
		      menuButton.style.display = "none";
	      });
	  }
	  if(closeButton && menu && menuButton){
	      closeButton.addEventListener('click', () => {
		      menu.classList.remove('show');
		      menuButton.classList.remove('open');
		      menuButton.style.display = "";
	      });
	  }
	  if(menu1){
	      menu1.addEventListener('click', () => {
		  if(menu1Sub){
		      menu1Sub.style.display = "block";
		      menu1Sub.style.opacity = "1";
      
		  }
      
	      });
	  }
      
}
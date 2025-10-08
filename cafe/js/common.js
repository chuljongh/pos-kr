jQuery(function($){

	$(".qna-list dt a").on("click", function(){
		if($(this).parent().hasClass("active") == true){
			$(this).parent().removeClass("active");
			$(this).parent().next('dd').stop().slideUp(300);
		}else{
			$(this).parent().addClass("active");
			$(this).parent().next('dd').stop().slideDown(300);
		}

		return false;
	});

	$(".btn-hamburger").on("click", function(){
		$(this).toggleClass("active");
		$(".mobile-menu").toggleClass("active");
	});

});
cc.game.onStart = function() {
	var designSize = cc.size(960, 640);
	var screenSize = cc.view.getFrameSize();

	cc.loader.resPath = "res/HD";
	// cc.FileUtils.getInstance().setSearchResolutionsOrder(resDirOrders);
	// director.setContentScaleFactor(resourceSize.width / designSize.width);
	cc.view.setDesignResolutionSize(designSize.width, designSize.height,
			cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);

	// turn on display FPS
	cc.director.setDisplayStats(this.config['showFPS']);

	// set FPS. the default value is 1.0/60 if you don't call this
	cc.director.setAnimationInterval(1.0 / this.config['frameRate']);

	// load resources
	cc.LoaderScene.preload(g_resources, function() {
		cc.director.runScene(new MainScene());
	}, this);

};
cc.game.run();

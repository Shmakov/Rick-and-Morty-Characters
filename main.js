var RAM = {
	episodes: null,
	characters: null,

	init: function()
	{
		RAM.init_episodes();
		RAM.init_characters();
		RAM.init_tooltips();
	},

	init_episodes: function()
	{
		var html = '';
		for (var i = 0, len = RAM.episodes.length; i < len; i++) {
			var episode = RAM.episodes[i];
			var css_class = 'episode';
			if (episode['season'] == 1 && episode['episode'] == 11 || episode['season'] == 2 && episode['episode'] == 10) css_class+= ' last-episode';
			html+= '<div class="' + css_class + '" title="S' + episode['season'] + 'E' + episode['episode'] + ': ' + episode['name'] + '">' + episode['episode'] + '</div>';
		}

		html+= '<div class="clear"></div>';

		$('#episodes').html(html);
	},

	init_characters: function()
	{
		var html = '';
		for (var i = 0, len = RAM.characters.length; i < len; i++) {
			var character = RAM.characters[i];
			var appearance = character['appearance'].slice(0); // Copy of the array, so we do not access it by reference
			html+= '<div class="row">';
			var cell = '';
			for (var j = RAM.episodes.length - 1; j >= 0; j--) {
				if (appearance.length === 0) continue;
				var episode = RAM.episodes[j];
				var css_class = 'cell';
				if (appearance[appearance.length - 1] === episode['code']) {
					css_class+= ' appeared';
					appearance.pop();
				}
				var cell_content = '';
				if (appearance.length === 0) {
					var character_css_class = character['appearance'].length >= 5 ? 'character-name character-main' : 'character-name';
					cell_content = '<div class="' + character_css_class + '"><span>' + character['name'] + '</span></div>';
				}
				if (character['died'] == episode['code']) {
					cell_content+= '<div class="death-dot"><div class="death-note" title="' + (character['death_note'] == '' ? 'Died' : character['death_note']) + '"></div></div>';
				}
				cell+= '<div class="' + css_class + '">' + cell_content + '</div>';
			}
			html+= cell;
			html+= '<div class="clear"></div>';
			html+= '</div>';
		}

		$('#characters').html(html);
	},

	init_tooltips: function()
	{
		$('.death-note').qtip({
			style: {
				classes: 'qtip-red qtip-shadow'
			}
		});
		$('.episode').qtip({
			style: {
				classes: 'qtip-red qtip-shadow'
			}
		});
		$('.character-name span').qtip({
			content: {
				text: function(event, api) {
					var name = $(this).text();
					var description = '';
					(function() {
						api.set('content.title', name);
						for (var i = 0, len = RAM.characters.length; i < len; i++) {
							var character = RAM.characters[i];
							if (character['name'] == name) {
								description = character['description'];
								if (character['image'] != '') {
									description = '<img src="media/' + character['image'] + '"><br />' + description;
								}
								break;
							}
						}
					})();
					return description;
				}
			},
			position: {
				target: 'mouse',
				adjust: {
					x: 25,
					y: 5
				}
			},
			style: {
				classes: 'qtip-red qtip-shadow'
			}
		});
	}
};
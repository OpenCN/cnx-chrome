function $D(data) {
	$.extend(this, data);
}

$.extend($D.prototype, {
	getmodifier: function(key){
		var total = 1, objects = cnx.data.modifiers, grw = [].concat(this.gov, this.resources, this.wonders), improvements = this.improvements;
		
		for (var name in objects) {
			var obj = objects[name];
			if (key in obj) {
				var effect = obj[key];
				effect = $.isFunction(effect) ? effect(this) : effect;
				if (grw.indexOf(name) !== -1) {
					total *= 1 + effect;
				} else if (name in improvements) {
					total *= 1 + (effect * improvements[name]);
				}
			}
		}
		
		if (key === "income_percent") {
			total *= this.edn === "te" ? 1.5 : 1;
			total *= this.tax;
		}
		
		return total;
	},
	infraBills: function(){
		var infra = this.infra,
			infraModifier = 0.175
			infraCutoffs = { 100: 0.04, 200: 0.05, 300: 0.06, 500: 0.07, 700: 0.08, 1000: 0.09, 2000: 0.11, 3000: 0.13, 4000: 0.15, 5000: 0.17, 8000: 0.1725 };
		
		for (var k in infraCutoffs) {
			if (infra < k) {
				infraModifier = infraCutoffs[k];
				break;
			}
		}
		
		var techModifier = (1 - ((2 * this.tech) / this.strength));
		if (techModifier < 0.9) { techModifier = 0.9; }
		
		return (((infraModifier * infra) + 20) * infra) * (this.getmodifier("infra_bills") * techModifier);
	},
	infraCost: function(){
		var infra = this.infra,
			infraModifier = 70,
			infraCutoffs = { 20: 1, 100: 12, 200: 15, 1000: 20, 3000: 25, 4000: 30, 5000: 40, 8000: 60 };
		
		for (var k in infraCutoffs) {
			if (infra < k) {
				infraModifier = infraCutoffs[k];
				break;
			}
		}
		
		return ((infraModifier * infra) + 500) * this.getmodifier("infra_cost");
	}
});
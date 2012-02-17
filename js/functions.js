function $D(data) {
	$.extend(true, this, typeof data === "string" ? cnx.data[data].nation_data : data);
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
		
		if (key === "income") {
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
	},
	modify: function(name, amount, count){
		count = count || 1;
		
		switch (name) {
			case "happiness": {
				var change = count * amount * (1 - ((this.environment - 1) / 100));
				
				this.citizen_tax += (2 * this.getmodifier("income")) * change;
				this.happiness += change;
				
				break;
			}
			case "citizens": {
				break;
			}
			case "environment": {
				amount = -amount;
				var change = count * amount,
					origEnv = this.environment, origIncome = this.citizen_tax, origCitizens = this.citizens,
					newEnv = this.environment - change, bestEnv = this.global_radiation + 1;
				
				if (newEnv < bestEnv) {
					newEnv = bestEnv;
					change = origEnv - bestEnv;
				}
				
				var ratio = (1 - ((newEnv - 1) * 0.01)) / (1 - ((origEnv - 1) * 0.01));
				//this.modify("happiness", (this.happiness * ratio - this.happiness) / (1 - ((this.environment - 1) / 100)));
				
				break;
			}
			case "cash": {
				this.citizen_tax += count * amount * this.getmodifier("income");
				
				break;
			}
			case "income": {
				break;
			}
		}
		
		return this;
	},
	difference: function(name, original){
		original = original || cnx.data[this.edn].nation_data;
		
		switch (name) {
			case "income": {
				return (this.citizen_tax * this.citizens) - (original.citizen_tax * original.citizens);
			}
			case "citizens": {
				return this.citizens - original.citizens;
			}
			case "land": {
				return this.land.total - original.land.total;
			}
		}
	}
});
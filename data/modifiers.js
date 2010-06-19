(function(modifiers){

function hasResource(name, effect) {
	return function(data){ return name in data.resources && effect; };
}

function forEachResource(resources, effect) {
	return function(data){
		return items.reduce(function(prev, cur){ return prev + (cur in data.resources); }, 0) * effect;
	};
}

modifiers.resources = {
	"Affluent Population": {
		citizens: +0.05
	}, "Aluminum": {
		infra_cost: -0.07
	}, "Asphalt": {
		infra_bills: -0.05
	}, "Automobiles": {
		happiness: +3
	}, "Basalt": {
		happiness: hasResource("Automobiles", +3),
		infra_bills: hasResource("Asphalt", -0.05),
		infra_cost: hasResource("Construction", -0.05)
	}, "Beer": {
		happiness: +2
	}, "Calcium": {
		income: forEachResource(["Furs", "Rubber", "Spices", "Wine"], +3)
	}, "Cattle": {
		citizens: +0.05
	}, "Coal": {
		infra_cost: -0.04,
		land: +0.15
	}, "Construction": {
		infra_cost: -0.05
	}, "Fast Food": {
		happiness: +2
	}, "Fine Jewelry": {
		happiness: +3
	}, "Fish": {
		citizens: +0.08
	}, "Furs": {
		income: +3.5
	}, "Gems": {
		happiness: +2.5,
		income: +1.5
	}, "Gold":{
		income: +3
	}, "Iron": {
		infra_bills: -0.10,
		infra_cost: -0.05
	}, "Lumber": {
		infra_bills: -0.08,
		infra_cost: -0.06
	}, "Magnesium": {
		happiness: hasResource("Microchips", 4),
		infra_bills: hasResource("Steel", -0.04)
	}, "Marble": {
		infra_cost: -0.10
	}, "Microchips": {
		happiness: +2
	}, "Oil": {
		happiness: +1.5
	}, "Pigs": {
		citizens: +0.035
	}, "Potassium": {
		happiness: +3,
		income: forEachResource(["Affluent Population", "Scholars"], +3)
	}, "Radiation Cleanup": {
		environment: -1
	}, "Radon": {
		income: forEachResource(["Gold", "Lead", "Uranium", "Water"], +3)
	}, "Rubber": {
		infra_cost: -0.03,
		land: +0.20
	}, "Scholars": {
		income: +3
	}, "Silicon": {
		income: forEachResource(["Furs", "Gems", "Rubber", "Silver"], +3)
	}, "Silver": {
		happiness: +2,
		income: +2
	}, "Sodium": {
		happiness: forEachResource(["Beer", "Fast Food"], +2)
	}, "Spices": {
		happiness: +2,
		land: +0.08
	}, "Steel": {
		infra_cost: -0.02
	}, "Sugar": {
		citizens: +0.03,
		happiness: +2
	}, "Titanium": {
		income: forEachResource(["Coal", "Gold", "Lead", "Oil"], +3)
	}, "Uranium": {
		infra_bills: -0.03
	}, "Water": {
		environment: -1,
		happiness: +2.5
	}, "Wheat": {
		citizens: +0.08
	}, "Wine": {
		happiness: +3
	}
};

modifiers.improvements = {
	"Bank": {
		income_percent: +0.07
	}, "Border Wall": {
		citizens: -0.02,
		environment: -1,
		happiness: +2
	}, "Church": {
		happiness: +1
	}, "Clinic": {
		citizens: +0.02
	}, "Factory": {
		infra_cost: -0.08
	}, "Foreign Ministry": {
		income_percent: +0.05
	}, "Guerrilla Camp": {
		income_percent: -0.08
	}, "Harbor": {
		income_percent: +0.01
	}, "Hospital": {
		citizens: +0.06
	}, "Intelligence Agency": {
		
	}, "Labor Camp": {
		happiness: -1,
		infra_bills: -0.1
	}, "Police Headquarters": {
		happiness: +2
	}, "School": {
		income_percent: +0.05
	}, "Stadium": {
		happiness: +3
	}, "University": {
		income_percent: +0.08
	}
};
	
modifiers.wonders = {
	"Agriculture Development Program": {
		income: +2,
		land: +0.15
	}, "Disaster Relief Agency": {
		citizens: +0.03
	}, "Great Monument": {
		happiness: +4
	}, "Great Temple": {
		happiness: +5
	}, "Great University": {
		happiness: function(data){
			var tech = data.tech - 200;
			if (tech < 0) { tech = 0; }
			if (tech > 2800) { tech = 2800; }
			return data.tech * +0.002;
		}
	}, "Internet": {
		happiness: +5
	}, "Interstate System": {
		infra_bills: -0.08,
		infra_cost: -0.08
	}, "Mining Industry Consortium": {
		income: forEachResource(["Coal", "Lead", "Oil", "Uranium"], +2)
	}, "Movie Industry": {
		happiness: +3
	}, "National Environment Office": {
		citizens: +0.03,
		environment: -1,
		infra_bills: -0.03
	}, "National Research Lab": {
		citizens: +0.05
	}, "National War Memorial": {
		happiness: +4
	}, "Nuclear Power Plant": {
		
	}, "Scientific Development Center": {
		
	}, "Social Security System": {
		
	}, "Space Program": {
		happiness: +3
	}, "Stock Market": {
		income: +10
	}, "Universal Health Care": {
		citizens: +0.03,
		happiness: +2
	}, "Weapons Research Complex": {
		environment: +1
	}
};

})(cnx.data.modifiers);
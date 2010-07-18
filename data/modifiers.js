(function(){

function hasResource(name, effect) {
	return function(data){ return name in data.resources && effect; };
}

function forEachResource(resources, effect) {
	return function(data){
		return resources.reduce(function(prev, cur){ return prev + (cur in data.resources); }, 0) * effect;
	};
}

var modifiers = {
	/* governments */
	"Anarchy": {
		
	}, "Capitalist": {
		infra_cost: -0.05,
		land: +0.05
	}, "Communist": {
		land: +0.05
	}, "Democracy": {
		happiness: +1
	}, "Dictatorship": {
		infra_cost: -0.05
	}, "Federal Government": {
		infra_cost: -0.05
	}, "Monarchy": {
		happiness: +1,
		infra_cost: -0.05,
		land: +0.05
	}, "Republic": {
		infra_cost: -0.05,
		land: +0.05
	}, "Revolutionary Government": {
		happiness: +1,
		infra_cost: -0.05
	}, "Totalitarian State": {
		happiness: +1,
		land: +0.05
	}, "Transitional": {
		land: +0.05
	},
	
	/* resources */
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
		cash: forEachResource(["Furs", "Rubber", "Spices", "Wine"], +3)
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
		cash: +3.5
	}, "Gems": {
		happiness: +2.5,
		cash: +1.5
	}, "Gold":{
		cash: +3
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
		cash: forEachResource(["Affluent Population", "Scholars"], +3)
	}, "Radiation Cleanup": {
		environment: -1
	}, "Radon": {
		cash: forEachResource(["Gold", "Lead", "Uranium", "Water"], +3)
	}, "Rubber": {
		infra_cost: -0.03,
		land: +0.20
	}, "Scholars": {
		cash: +3
	}, "Silicon": {
		cash: forEachResource(["Furs", "Gems", "Rubber", "Silver"], +3)
	}, "Silver": {
		happiness: +2,
		cash: +2
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
		cash: forEachResource(["Coal", "Gold", "Lead", "Oil"], +3)
	}, "Uranium": {
		infra_bills: -0.03
	}, "Water": {
		environment: -1,
		happiness: +2.5
	}, "Wheat": {
		citizens: +0.08
	}, "Wine": {
		happiness: +3
	},
	
	/* improvements */
	"Bank": {
		income: +0.07
	}, "Border Wall": {
		citizens: -0.02,
		environment: -1,
		happiness: +2
	}, "Church": {
		happiness: +1
	}, "Clinic": {
		citizens: +0.02
	}, "Factory": {
		infra_cost: function(data){ return data.wonders.indexOf("Scientific Development Center") === -1 ? -0.08 : -0.10; }
	}, "Foreign Ministry": {
		income: +0.05
	}, "Guerrilla Camp": {
		income: -0.08
	}, "Harbor": {
		income: +0.01
	}, "Hospital": {
		citizens: +0.06
	}, "Intelligence Agency": {
		happiness: function(data){ return data.tax > 23 ? +1 : 0; }
	}, "Labor Camp": {
		happiness: -1,
		infra_bills: -0.10
	}, "Police Headquarters": {
		happiness: +2
	}, "School": {
		income: +0.05
	}, "Stadium": {
		happiness: +3
	}, "University": {
		income: function(data){ return data.wonders.indexOf("Scientific Development Center") === -1 ? +0.08 : +0.10; }
	},
	
	/* wonders */
	"Agriculture Development Program": {
		cash: +2,
		land: +0.15
	}, "Disaster Relief Agency": {
		citizens: +0.03
	}, "Great Monument": {
		happiness: +4
	}, "Great Temple": {
		happiness: +5
	}, "Great University": {
		happiness: function(data){
			var tech = data.tech - 200, SDC = data.wonders.indexOf("Scientific Development Center") !== -1;
			if (tech < 0) { tech = 0; }
			if (SDC && tech > 4800) {
				tech = 4800;
			} else if (!SDC && tech > 2800) {
				tech = 2800;
			}
			return data.tech * +0.002;
		}
	}, "Internet": {
		happiness: +5
	}, "Interstate System": {
		infra_bills: -0.08,
		infra_cost: -0.08
	}, "Mining Industry Consortium": {
		cash: forEachResource(["Coal", "Lead", "Oil", "Uranium"], +2)
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
		
	}, "Social Security System": {
		
	}, "Space Program": {
		happiness: +3
	}, "Stock Market": {
		cash: +10
	}, "Universal Health Care": {
		citizens: +0.03,
		happiness: +2
	}, "Weapons Research Complex": {
		environment: +1
	}
};

var improvementNames = {
	"Bank": "Banks",
	"Border Wall": "Border Walls",
	"Church": "Churches",
	"Clinic": "Clinics",
	"Factory": "Factories",
	"Foreign Ministry": "Foreign Ministries",
	"Guerrilla Camp": "Guerrilla Camps",
	"Harbor": "Harbors",
	"Hospital": "Hospitals",
	"Intelligence Agency": "Intelligence Agencies",
	"Labor Camp": "Labor Camps",
	"Police Headquarters": "Police Headquarters",
	"School": "Schools",
	"Stadium": "Stadiums",
	"University": "Universities"
};
for (var k in improvementNames) {
	modifiers[improvementNames[k]] = modifiers[k];
}

cnx.data.modifiers = modifiers;

})();
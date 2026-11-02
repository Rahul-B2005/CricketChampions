import Team from '../models/Team.js';
import Player from '../models/Player.js';

// Real international men's players, based on 2026 national-team squads / recent official XIs.
// Player names are used for the game presentation; this app does not use player photos or likenesses.
const squads = [
  ['India','IND','🇮🇳','#2563eb',[
    ['Shubman Gill','Batter'],['Rohit Sharma','Batter'],['Virat Kohli','Batter'],['KL Rahul','Wicketkeeper'],['Ruturaj Gaikwad','Batter'],
    ['Ravindra Jadeja','All-rounder'],['Nitish Kumar Reddy','All-rounder'],['Axar Patel','All-rounder'],['Kuldeep Yadav','Bowler'],['Mohammed Siraj','Bowler'],['Prasidh Krishna','Bowler'],
    ['Jasprit Bumrah','Bowler'],['Yashasvi Jaiswal','Batter'],['Sanju Samson','Wicketkeeper'],['Arshdeep Singh','Bowler'],['Suryakumar Yadav','Batter'],['Rishabh Pant','Wicketkeeper'],['Mohammed Shami','Bowler']
  ]],
  ['Australia','AUS','🇦🇺','#facc15',[
    ['Mitchell Marsh','All-rounder'],['Travis Head','Batter'],['Marnus Labuschagne','Batter'],['Steve Smith','Batter'],['Josh Inglis','Wicketkeeper'],
    ['Alex Carey','Wicketkeeper'],['Cameron Green','All-rounder'],['Matthew Renshaw','Batter'],['Pat Cummins','Bowler'],['Mitchell Starc','Bowler'],['Josh Hazlewood','Bowler'],
    ['Adam Zampa','Bowler'],['Xavier Bartlett','Bowler'],['Nathan Ellis','Bowler'],['Cooper Connolly','All-rounder'],['Jake Fraser-McGurk','Batter'],['Marcus Stoinis','All-rounder'],['Spencer Johnson','Bowler']
  ]],
  ['England','ENG','🏴','#dc2626',[
    ['Harry Brook','Batter'],['Ben Duckett','Batter'],['Joe Root','Batter'],['Tom Banton','Batter'],['Jos Buttler','Wicketkeeper'],
    ['Will Jacks','All-rounder'],['Jacob Bethell','All-rounder'],['Sam Curran','All-rounder'],['Liam Dawson','All-rounder'],['Jofra Archer','Bowler'],
    ['Gus Atkinson','Bowler'],['Adil Rashid','Bowler'],['Josh Tongue','Bowler'],['Rehan Ahmed','Bowler'],['Brydon Carse','Bowler'],['Phil Salt','Wicketkeeper'],['Jamie Smith','Wicketkeeper'],['Mark Wood','Bowler']
  ]],
  ['Pakistan','PAK','🇵🇰','#16a34a',[
    ['Babar Azam','Batter'],['Saim Ayub','Batter'],['Sahibzada Farhan','Wicketkeeper'],['Salman Ali Agha','All-rounder'],['Shadab Khan','All-rounder'],
    ['Fakhar Zaman','Batter'],['Saud Shakeel','Batter'],['Mohammad Rizwan','Wicketkeeper'],['Abdul Samad','Batter'],['Mohammad Nawaz','All-rounder'],
    ['Shaheen Shah Afridi','Bowler'],['Naseem Shah','Bowler'],['Abrar Ahmed','Bowler'],['Haris Rauf','Bowler'],['Sufyan Moqim','Bowler'],['Imam-ul-Haq','Batter'],['Usama Mir','Bowler'],['Mohammad Wasim Jr','Bowler']
  ]],
  ['South Africa','SA','🇿🇦','#f59e0b',[
    ['Temba Bavuma','Batter'],['Aiden Markram','All-rounder'],['Quinton de Kock','Wicketkeeper'],['Tony de Zorzi','Batter'],['Matthew Breetzke','Batter'],
    ['Ryan Rickelton','Wicketkeeper'],['David Miller','Batter'],['Tristan Stubbs','Batter'],['Marco Jansen','All-rounder'],['Corbin Bosch','All-rounder'],
    ['Keshav Maharaj','Bowler'],['Kagiso Rabada','Bowler'],['Gerald Coetzee','Bowler'],['Kwena Maphaka','Bowler'],['Lungi Ngidi','Bowler'],['Reeza Hendricks','Batter'],['Heinrich Klaasen','Wicketkeeper'],['Anrich Nortje','Bowler']
  ]],
  ['New Zealand','NZ','🇳🇿','#e5e7eb',[
    ['Tom Latham','Wicketkeeper'],['Devon Conway','Batter'],['Will Young','Batter'],['Rachin Ravindra','All-rounder'],['Daryl Mitchell','All-rounder'],
    ['Glenn Phillips','All-rounder'],['Michael Bracewell','All-rounder'],['Mark Chapman','Batter'],['Mitchell Santner','All-rounder'],['Matt Henry','Bowler'],
    ['Kyle Jamieson','Bowler'],['Will O\'Rourke','Bowler'],['Ben Sears','Bowler'],['Jacob Duffy','Bowler'],['Nathan Smith','Bowler'],['Finn Allen','Batter'],['Tim Seifert','Wicketkeeper'],['Lockie Ferguson','Bowler']
  ]],
  ['Sri Lanka','SL','🇱🇰','#f59e0b',[
    ['Pathum Nissanka','Batter'],['Kusal Mendis','Wicketkeeper'],['Charith Asalanka','Batter'],['Kamindu Mendis','All-rounder'],['Kusal Perera','Wicketkeeper'],
    ['Janith Liyanage','Batter'],['Dasun Shanaka','All-rounder'],['Wanindu Hasaranga','All-rounder'],['Dunith Wellalage','All-rounder'],['Maheesh Theekshana','Bowler'],
    ['Dilshan Madushanka','Bowler'],['Asitha Fernando','Bowler'],['Dushmantha Chameera','Bowler'],['Nuwan Thushara','Bowler'],['Eshan Malinga','Bowler'],['Dhananjaya de Silva','All-rounder'],['Bhanuka Rajapaksa','Batter'],['Pramod Madushan','Bowler']
  ]],
  ['Bangladesh','BAN','🇧🇩','#15803d',[
    ['Tanzid Hasan Tamim','Batter'],['Saif Hassan','Batter'],['Najmul Hossain Shanto','Batter'],['Litton Kumer Das','Wicketkeeper'],['Tawhid Hridoy','Batter'],
    ['Mehidy Hasan Miraz','All-rounder'],['Mosaddek Hossain Saikat','All-rounder'],['Mahmudullah','All-rounder'],['Taskin Ahmed','Bowler'],['Mustafizur Rahman','Bowler'],
    ['Nahid Rana','Bowler'],['Tanvir Islam','Bowler'],['Rishad Hossain','Bowler'],['Shoriful Islam','Bowler'],['Jaker Ali','Wicketkeeper'],['Soumya Sarkar','All-rounder'],['Mushfiqur Rahim','Wicketkeeper'],['Tanzim Hasan Sakib','Bowler']
  ]],
  ['Afghanistan','AFG','🇦🇫','#2563eb',[
    ['Ibrahim Zadran','Batter'],['Rahmanullah Gurbaz','Wicketkeeper'],['Sediqullah Atal','Batter'],['Darwish Rasooli','Batter'],['Hashmatullah Shahidi','Batter'],
    ['Azmatullah Omarzai','All-rounder'],['Gulbadin Naib','All-rounder'],['Mohammad Nabi','All-rounder'],['Rashid Khan','Bowler'],['Noor Ahmad','Bowler'],
    ['Mujeeb Ur Rahman','Bowler'],['Naveen-ul-Haq','Bowler'],['Fazalhaq Farooqi','Bowler'],['Nangyal Kharoti','Bowler'],['AM Ghazanfar','Bowler'],['Karim Janat','All-rounder'],['Rahmat Shah','Batter'],['Ikram Alikhil','Wicketkeeper']
  ]],
  ['West Indies','WI','🏝️','#7c3aed',[
    ['Shai Hope','Wicketkeeper'],['Brandon King','Batter'],['John Campbell','Batter'],['Keacy Carty','Batter'],['Shimron Hetmyer','Batter'],
    ['Roston Chase','All-rounder'],['Jason Holder','All-rounder'],['Rovman Powell','All-rounder'],['Sherfane Rutherford','Batter'],['Matthew Forde','All-rounder'],
    ['Akeal Hosein','Bowler'],['Gudakesh Motie','Bowler'],['Alzarri Joseph','Bowler'],['Jayden Seales','Bowler'],['Romario Shepherd','All-rounder'],['Nicholas Pooran','Wicketkeeper'],['Evin Lewis','Batter'],['Andre Russell','All-rounder']
  ]],
];

const styles = {
  Batter: ['Right-hand bat',''],
  Wicketkeeper: ['Right-hand bat',''],
  'All-rounder': ['Right-hand bat','Right-arm pace'],
  Bowler: ['Right-hand bat','Right-arm pace']
};

const formatProfiles = {
  T20: { overs: 20, order: [15,16,17,0,3,5,6,7,8,9,10,11,12,13,14] },
  ODI: { overs: 50, order: [0,2,1,3,4,5,6,7,8,9,10,11,12,13,15] },
  Test: { overs: 90, order: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] }
};

// Latest verified 2026 format-specific selections available from official boards / ICC reporting.
// These override the generic pool above so T20/ODI/Test are genuinely different squads.
const formatSquadOverrides = {
  India: {
    T20: [
      ['Shreyas Iyer','Batter'],['Abhishek Sharma','All-rounder'],['Vaibhav Sooryavanshi','Batter'],['Ishan Kishan','Wicketkeeper'],['Sanju Samson','Wicketkeeper'],
      ['Tilak Varma','Batter'],['Shivam Dube','All-rounder'],['Kuldeep Yadav','Bowler'],['Axar Patel','All-rounder'],['Washington Sundar','All-rounder'],
      ['Ravi Bishnoi','Bowler'],['Nitish Kumar Reddy','All-rounder'],['Arshdeep Singh','Bowler'],['Prince Yadav','Bowler'],['Mayank Yadav','Bowler']
    ],
    ODI: [
      ['Shubman Gill','Batter'],['Rohit Sharma','Batter'],['Virat Kohli','Batter'],['Ruturaj Gaikwad','Batter'],['KL Rahul','Wicketkeeper'],
      ['Dhruv Jurel','Wicketkeeper'],['Nitish Kumar Reddy','All-rounder'],['Ravindra Jadeja','All-rounder'],['Kuldeep Yadav','Bowler'],['Prasidh Krishna','Bowler'],
      ['Gurnoor Brar','Bowler'],['Mohammed Siraj','Bowler'],['Auqib Nabi','Bowler'],['Yashasvi Jaiswal','Batter'],['Naman Dhir','All-rounder']
    ],
    Test: [
      ['Shubman Gill','Batter'],['KL Rahul','Wicketkeeper'],['Yashasvi Jaiswal','Batter'],['Rishabh Pant','Wicketkeeper'],['Sai Sudharsan','Batter'],
      ['Dhruv Jurel','Wicketkeeper'],['Ravindra Jadeja','All-rounder'],['Kuldeep Yadav','Bowler'],['Manav Suthar','Bowler'],['Jasprit Bumrah','Bowler'],
      ['Mohammed Siraj','Bowler'],['Prasidh Krishna','Bowler'],['Gurnoor Brar','Bowler'],['Devdutt Padikkal','Batter'],['Saransh Jain','All-rounder']
    ]
  },
  Australia: {
    ODI: [
      ['Mitchell Marsh','All-rounder'],['Pat Cummins','Bowler'],['Xavier Bartlett','Bowler'],['Alex Carey','Wicketkeeper'],['Cooper Connolly','All-rounder'],
      ['Joel Davies','Batter'],['Nathan Ellis','Bowler'],['Cameron Green','All-rounder'],['Josh Hazlewood','Bowler'],['Travis Head','Batter'],
      ['Josh Inglis','Wicketkeeper'],['Spencer Johnson','Bowler'],['Oliver Peake','Batter'],['Matthew Renshaw','Batter'],['Billy Stanlake','Bowler'],['Mitchell Starc','Bowler'],['Adam Zampa','Bowler']
    ],
    Test: [
      ['Pat Cummins','Bowler'],['Scott Boland','Bowler'],['Alex Carey','Wicketkeeper'],['Cooper Connolly','All-rounder'],['Cameron Green','All-rounder'],
      ['Josh Hazlewood','Bowler'],['Travis Head','Batter'],['Josh Inglis','Wicketkeeper'],['Matthew Kuhnemann','Bowler'],['Marnus Labuschagne','Batter'],
      ['Nathan Lyon','Bowler'],['Michael Neser','All-rounder'],['Matthew Renshaw','Batter'],['Steve Smith','Batter'],['Mitchell Starc','Bowler'],['Beau Webster','All-rounder']
    ]
  },
  England: {
    T20: [
      ['Harry Brook','Batter'],['Jofra Archer','Bowler'],['Gus Atkinson','Bowler'],['Sonny Baker','All-rounder'],['Tom Banton','Wicketkeeper'],
      ['Jacob Bethell','All-rounder'],['Jos Buttler','Wicketkeeper'],['Brydon Carse','Bowler'],['Sam Curran','All-rounder'],['Liam Dawson','All-rounder'],
      ['Aneurin Donald','Batter'],['Jamie Overton','All-rounder'],['Adil Rashid','Bowler'],['Rehan Ahmed','Bowler'],['Phil Salt','Wicketkeeper'],['Luke Wood','Bowler']
    ],
    ODI: [
      ['Harry Brook','Batter'],['Jofra Archer','Bowler'],['Gus Atkinson','Bowler'],['Sonny Baker','All-rounder'],['Tom Banton','Wicketkeeper'],
      ['Jacob Bethell','All-rounder'],['Jos Buttler','Wicketkeeper'],['Brydon Carse','Bowler'],['Sam Curran','All-rounder'],['Liam Dawson','All-rounder'],
      ['Aneurin Donald','Batter'],['Jamie Overton','All-rounder'],['Adil Rashid','Bowler'],['Jamie Smith','Wicketkeeper'],['Phil Salt','Wicketkeeper'],['Mark Wood','Bowler']
    ],
    Test: [
      ['Joe Root','Batter'],['Jofra Archer','Bowler'],['Gus Atkinson','Bowler'],['Sonny Baker','All-rounder'],['Shoaib Bashir','Bowler'],
      ['Harry Brook','Batter'],['Sam Cook','Bowler'],['Jordan Cox','Wicketkeeper'],['Ben Duckett','Batter'],['Emilio Gay','Batter'],
      ['Dan Lawrence','Batter'],['Ollie Pope','Wicketkeeper'],['Ollie Robinson','Bowler'],['Jamie Smith','Wicketkeeper'],['Josh Tongue','Bowler']
    ]
  }
};

export const seedInternational = async (req, res) => {
  const format = ['T20','ODI','Test'].includes(req.body?.format) ? req.body.format : 'T20';
  const profile = formatProfiles[format];
  const teams = [];
  for (const [name, code, flag, accent, squad] of squads) {
    let team = await Team.findOne({ owner: req.user.id, name });
    const formatSquad = formatSquadOverrides[name]?.[format] || profile.order.map(i => squad[i]);
    const desiredNames = formatSquad.map(x => x[0]);
    let existingPlayers = team?.players?.length ? await Player.find({ _id: { $in: team.players }, owner: req.user.id }) : [];
    const hasGeneratedNames = existingPlayers.some(p => p.name.startsWith(`${name} `));

    const needsFormatRebuild = desiredNames.some(n => !existingPlayers.some(p => p.name === n));
    if (!team || existingPlayers.length < 15 || hasGeneratedNames || needsFormatRebuild) {
      if (existingPlayers.length) await Player.deleteMany({ _id: { $in: existingPlayers.map(p => p._id) }, owner: req.user.id });
      const players = await Player.insertMany(formatSquad.map(([playerName, role], i) => {
        const [battingStyle, bowlingStyle] = styles[role] || styles.Bowler;
        return {
          owner: req.user.id, name: playerName, role,
          tier: i < 6 ? 'Gold' : 'Silver',
          battingRating: Math.min(99, 82 + ((i * 5 + name.length) % 15)),
          bowlingRating: role === 'Batter' || role === 'Wicketkeeper' ? 35 + (i % 10) : Math.min(99, 78 + ((i * 7 + code.length) % 19)),
          fieldingRating: Math.min(99, 80 + ((i * 4) % 17)), battingStyle, bowlingStyle
        };
      }));
      if (!team) {
        team = await Team.create({ owner: req.user.id, name, code, flag, accent, players: players.map(p=>p._id), playingXI: players.slice(0,11).map(p=>p._id) });
      } else {
        team.code=code; team.flag=flag; team.accent=accent; team.players=players.map(p=>p._id); team.playingXI=players.slice(0,11).map(p=>p._id); await team.save();
      }
    } else {
      team.code=code; team.flag=flag; team.accent=accent;
      // Keep the selected format's squad order and Playing XI without rebuilding players.
      const byName = new Map(existingPlayers.map(p => [p.name, p]));
      const ordered = desiredNames.map(n => byName.get(n)).filter(Boolean);
      if (ordered.length >= 11) team.playingXI = ordered.slice(0,11).map(p=>p._id);
      team.players = ordered.length ? ordered.map(p=>p._id) : team.players;
      await team.save();
    }
    team = await Team.findById(team._id).populate('players').populate('playingXI');
    team = team.toObject();
    team.format = format;
    team.formatOvers = profile.overs;
    team.formatSquad = formatSquad.map(([playerName, role]) => ({ name: playerName, role }));
    teams.push(team);
  }
  res.json(teams);
};

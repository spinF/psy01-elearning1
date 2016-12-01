library(xtable)

data <- read.csv('data/lektion1/dataset_studienanfaenger.csv')

data$prognoseStudienerfolg[data$prognoseStudienerfolg == '1'] <- 'niedrig'
data$prognoseStudienerfolg[data$prognoseStudienerfolg == '2'] <- 'mittel'
data$prognoseStudienerfolg[data$prognoseStudienerfolg == '3'] <- 'hoch'

frequencyTable <- as.data.frame(table(data$prognoseStudienerfolg))
frequencyTable <- transform(frequencyTable, relFreq = prop.table(Freq))

colnames(frequencyTable)[names(frequencyTable) == 'Var1'] <- 'Studienerfolgsprognose'
colnames(frequencyTable)[names(frequencyTable) == 'Freq'] <- 'Absolute Häufigkeit'
colnames(frequencyTable)[names(frequencyTable) == 'relFreq'] <- 'Relative Häufigkeit'

dir.create("build/latex/gen/lektion1/aufgabe_1b", recursive=TRUE)
print(xtable(frequencyTable, digits=c(1,1,1,3), caption="Häufigkeitstabelle für die Studienerfolgsprognose"), file="build/latex/gen/lektion1/aufgabe_1b/haeufigkeitstabelle.tex", include.rownames=FALSE, table.placement='h')

pdf('build/latex/gen/lektion1/aufgabe_1b/kreisdiagramm.pdf', width=4,height=4)
par(mar=c(1,1,1,1))
pie(table(data$prognoseStudienerfolg))
dev.off()

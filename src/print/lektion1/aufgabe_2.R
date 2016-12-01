
data <- read.csv('data/lektion1/dataset_studienanfaenger.csv')

abiturnoteMaennlich <-subset(data,data$geschlecht == 2)$abiturnote

prognoseStudienerfolgWeiblich <- subset(data,data$geschlecht == 1)$prognoseStudienerfolg

dir.create("build/latex/gen/lektion1/aufgabe_2", recursive=TRUE)
sink('build/latex/gen/lektion1/aufgabe_2/results.tex')

cat("Durchschnittsnoten im Abitur der männlichen Teilnehmer: ", abiturnoteMaennlich, "\n")

cat("Median der Durchschnittsnote im Abitur der männlichen Teilnehmer: ", median(abiturnoteMaennlich), "\n")

cat("Arithmetisches Mittel der Durchschnittsnote im Abitur der männlichen Teilnehmer: ", mean(abiturnoteMaennlich), "\n")

cat("Standardabweichung der Durchschnittsnote im Abitur der männlichen Teilnehmer: ", sqrt(var(abiturnoteMaennlich)), "\n")

cat("===\n");

cat("Prognosen für den Studienerfolg der weiblichen Teilnehmer: ", prognoseStudienerfolgWeiblich, "\n")

cat("Median der Prognose für den Studienerfolg der weiblichen Teilnehmer: ", median(prognoseStudienerfolgWeiblich), "\n")

cat("Variationsbreite der Prognose für den Studienerfolg der weiblichen Teilnehmer: ", max(prognoseStudienerfolgWeiblich) - min(prognoseStudienerfolgWeiblich), "\n")

sink()

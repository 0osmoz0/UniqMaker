// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'freelancerdb.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class FreelancerAdapter extends TypeAdapter<Freelancer> {
  @override
  final int typeId = 0;

  @override
  Freelancer read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Freelancer(
      prenom: fields[0] as String,
      nom: fields[1] as String,
      email: fields[2] as String,
      motDePasse: fields[3] as String,
      dateNaissance: fields[4] as String,
      region: fields[5] as String,
      profession: fields[6] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Freelancer obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.prenom)
      ..writeByte(1)
      ..write(obj.nom)
      ..writeByte(2)
      ..write(obj.email)
      ..writeByte(3)
      ..write(obj.motDePasse)
      ..writeByte(4)
      ..write(obj.dateNaissance)
      ..writeByte(5)
      ..write(obj.region)
      ..writeByte(6)
      ..write(obj.profession);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FreelancerAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

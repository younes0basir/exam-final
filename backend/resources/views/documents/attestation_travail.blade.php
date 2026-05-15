@extends('documents.layout')

@section('content')
    <div class="section">
        <div class="section-title">Attestation de Travail</div>

        <p style="margin: 20px 0; text-align: justify;">
            Le Directeur de l'Université Privée de Fès atteste que :
        </p>

        <div class="info-row">
            <span class="info-label">Nom et Prénom :</span>
            <span class="info-value">{{ $user->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fonction :</span>
            <span class="info-value">Professeur</span>
        </div>

        @if($modules && $modules->count() > 0)
        <div class="info-row">
            <span class="info-label">Modules enseignés :</span>
            <span class="info-value">{{ $modules->pluck('nom')->implode(', ') }}</span>
        </div>
        @endif

        <p style="margin: 30px 0; text-align: justify;">
            est employé(e) par l'Université Privée de Fès en tant que Professeur.
        </p>

        <p style="margin: 20px 0; text-align: justify;">
            Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>

        <div style="margin-top: 30px;">
            <span class="badge badge-success">Document Validé</span>
        </div>
    </div>
@endsection
